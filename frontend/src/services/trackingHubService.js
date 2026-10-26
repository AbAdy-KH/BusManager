import * as signalR from '@microsoft/signalr';
import { getHubUrl, API_ROUTES } from '../config/api.config';
import { getValidAccessToken } from './authService';

/**
 * Creates and configures a standard SignalR Hub Connection.
 */
function createHubConnection() {
  return new signalR.HubConnectionBuilder()
    .withUrl(getHubUrl(API_ROUTES.HUBS.TRACKING), {
      accessTokenFactory: async () => (await getValidAccessToken()) || '',
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
    .configureLogging(signalR.LogLevel.Warning)
    .build();
}

/**
 * Starts tracking stream for Admins.
 */
export async function startAdminTracking({ onLocationReceived, onStatusChange }) {
  const connection = createHubConnection();

  const updateStatus = (status) => onStatusChange?.(status);

  // Bind connection status hooks
  connection.onreconnecting(() => updateStatus('connecting'));
  connection.onreconnected(async () => {
    updateStatus('connected');
    await connection.invoke('JoinAdminGroup').catch(console.error);
  });
  connection.onclose(() => updateStatus('disconnected'));

  // Bind location handler
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

  updateStatus('connecting');
  await connection.start();
  await connection.invoke('JoinAdminGroup');
  updateStatus('connected');

  return {
    connection,
    stop: async () => {
      await connection.stop().catch(() => {});
      updateStatus('disconnected');
    },
  };
}

/**
 * Sends driver location updates sequentially, safely managing connection initialization.
 */
let driverConnection = null;
let connectionPromise = null;

async function getDriverConnection() {
  if (driverConnection?.state === signalR.HubConnectionState.Connected) {
    return driverConnection;
  }

  // Prevent multiple concurrent .start() calls (race condition)
  if (!connectionPromise) {
    driverConnection = createHubConnection();
    connectionPromise = driverConnection
      .start()
      .then(() => driverConnection)
      .finally(() => {
        connectionPromise = null;
      });
  }

  return connectionPromise;
}

export async function sendDriverLocation(location) {
  try {
    const connection = await getDriverConnection();
    await connection.invoke('SendBusLocation', {
      busId: Number(location.busId),
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
    });
  } catch (err) {
    console.error('Failed to send driver location:', err);
  }
}

export async function closeDriverConnection() {
  if (driverConnection) {
    await driverConnection.stop().catch(() => {});
    driverConnection = null;
  }
}