import * as signalR from '@microsoft/signalr';
import { getHubUrl, API_ROUTES } from '../config/api.config';
import { getAccessToken } from './authService';

/**
 * Creates a SignalR connection with automatic JWT token injection.
 */
function createHubConnection() {
  const hubUrl = getHubUrl(API_ROUTES.HUBS.TRACKING);
  return new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => {
        const token = getAccessToken();
        return token || '';
      },
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .configureLogging(signalR.LogLevel.Warning)
    .build();
}

/**
 * Connects to TrackingHub and joins the Admins group (Admin only).
 * Listens for live bus locations from driver emissions.
 *
 * @param {Object} options
 * @param {(location: { busId: number, latitude: number, longitude: number }) => void} options.onLocationReceived
 * @param {(status: 'connecting' | 'connected' | 'disconnected' | 'error') => void} [options.onStatusChange]
 * @returns {Promise<{ connection: signalR.HubConnection, stop: () => Promise<void> }>}
 */
export async function startAdminTracking({ onLocationReceived, onStatusChange }) {
  const connection = createHubConnection();

  connection.onreconnecting(() => onStatusChange?.('connecting'));
  connection.onreconnected(() => {
    onStatusChange?.('connected');
    connection.invoke('JoinAdminGroup').catch(() => {});
  });
  connection.onclose(() => onStatusChange?.('disconnected'));

  if (onLocationReceived) {
    connection.on('ReceiveBusLocation', (loc) => {
      onLocationReceived({
        busId: Number(loc.busId),
        latitude: Number(loc.latitude),
        longitude: Number(loc.longitude),
        timestamp: new Date().toLocaleTimeString(),
      });
    });
  }

  onStatusChange?.('connecting');
  await connection.start();
  onStatusChange?.('connected');

  // Join admin group to receive broadcasts
  await connection.invoke('JoinAdminGroup');

  return {
    connection,
    stop: async () => {
      try {
        await connection.stop();
        onStatusChange?.('disconnected');
      } catch {
        // ignore
      }
    },
  };
}

/**
 * Sends a single bus location to the server from a driver client.
 *
 * @param {{ busId: number, latitude: number, longitude: number }} location
 */
let sharedDriverConnection = null;

export async function sendDriverLocation({ busId, latitude, longitude }) {
  if (!sharedDriverConnection || sharedDriverConnection.state === signalR.HubConnectionState.Disconnected) {
    sharedDriverConnection = createHubConnection();
    await sharedDriverConnection.start();
  }

  if (sharedDriverConnection.state === signalR.HubConnectionState.Connected) {
    await sharedDriverConnection.invoke('SendBusLocation', {
      busId: Number(busId),
      latitude: Number(latitude),
      longitude: Number(longitude),
    });
  }
}

/**
 * Closes the active driver connection if open.
 */
export async function closeDriverConnection() {
  if (sharedDriverConnection) {
    try {
      await sharedDriverConnection.stop();
    } catch {
      // ignore
    }
    sharedDriverConnection = null;
  }
}
