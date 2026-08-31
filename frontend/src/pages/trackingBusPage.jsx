import React, { useState, useRef, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { Radio, Navigation, Trash2, Wifi, WifiOff, Send } from "lucide-react";

const HUB_PATH = "/trackingHub"; // adjust to match your actual MapHub(...) path

function StatusPill({ state }) {
  const map = {
    disconnected: { label: "Disconnected", cls: "bg-slate-100 text-slate-500", icon: WifiOff },
    connecting: { label: "Connecting…", cls: "bg-amber-100 text-amber-700", icon: Wifi },
    connected: { label: "Connected", cls: "bg-emerald-100 text-emerald-700", icon: Wifi },
    error: { label: "Error", cls: "bg-red-100 text-red-700", icon: WifiOff },
  };
  const { label, cls, icon: Icon } = map[state] || map.disconnected;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
      <Icon size={13} />
      {label}
    </span>
  );
}

function usePanelConnection(baseUrl) {
  const [state, setState] = useState("disconnected");
  const [log, setLog] = useState([]);
  const connRef = useRef(null);

  const pushLog = useCallback((line) => {
    setLog((prev) => [{ id: crypto.randomUUID(), time: new Date().toLocaleTimeString(), line }, ...prev].slice(0, 50));
  }, []);

  const connect = useCallback(async (onLocation) => {
    if (connRef.current) return connRef.current;
    setState("connecting");
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${baseUrl}${HUB_PATH}`)
      .withAutomaticReconnect()
      .build();

    conn.onreconnecting(() => { setState("connecting"); pushLog("Reconnecting…"); });
    conn.onreconnected(() => { setState("connected"); pushLog("Reconnected"); });
    conn.onclose((err) => { setState("disconnected"); pushLog(`Closed${err ? `: ${err.message}` : ""}`); });

    if (onLocation) {
      conn.on("ReceiveBusLocation", (loc) => {
        pushLog(`ReceiveBusLocation → Bus #${loc.busId} @ (${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)})`);
        onLocation(loc);
      });
    }

    try {
      await conn.start();
      connRef.current = conn;
      setState("connected");
      pushLog("Connection started");
    } catch (err) {
      setState("error");
      pushLog(`Failed to connect: ${err.message}`);
    }
    return conn;
  }, [baseUrl, pushLog]);

  const disconnect = useCallback(async () => {
    if (connRef.current) {
      await connRef.current.stop();
      connRef.current = null;
      setState("disconnected");
    }
  }, []);

  return { state, log, connRef, connect, disconnect, pushLog, clearLog: () => setLog([]) };
}

function DriverPanel({ baseUrl }) {
  const { state, log, connRef, connect, disconnect, pushLog, clearLog } = usePanelConnection(baseUrl);
  const [busId, setBusId] = useState(1);
  const [lat, setLat] = useState(32.5556);
  const [lng, setLng] = useState(35.8500);
  const [simRunning, setSimRunning] = useState(false);
  const simRef = useRef(null);

  const sendOnce = async () => {
    const conn = connRef.current || (await connect());
    try {
      await conn.invoke("SendBusLocation", { busId: Number(busId), latitude: Number(lat), longitude: Number(lng) });
      pushLog(`Sent → Bus #${busId} @ (${lat}, ${lng})`);
    } catch (err) {
      pushLog(`Send failed: ${err.message}`);
    }
  };

  const toggleSim = async () => {
    if (simRunning) {
      clearInterval(simRef.current);
      simRef.current = null;
      setSimRunning(false);
      return;
    }
    const conn = connRef.current || (await connect());
    setSimRunning(true);
    simRef.current = setInterval(async () => {
      const jitterLat = (Math.random() - 0.5) * 0.002;
      const jitterLng = (Math.random() - 0.5) * 0.002;
      const newLat = Number(lat) + jitterLat;
      const newLng = Number(lng) + jitterLng;
      setLat(newLat.toFixed(6));
      setLng(newLng.toFixed(6));
      try {
        await conn.invoke("SendBusLocation", { busId: Number(busId), latitude: newLat, longitude: newLng });
        pushLog(`Sim tick → Bus #${busId} @ (${newLat.toFixed(5)}, ${newLng.toFixed(5)})`);
      } catch (err) {
        pushLog(`Sim send failed: ${err.message}`);
      }
    }, 2000);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <Navigation size={18} className="text-indigo-500" />
          Driver client
        </div>
        <StatusPill state={state} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <label className="text-xs text-slate-500 flex flex-col gap-1">
          Bus ID
          <input value={busId} onChange={(e) => setBusId(e.target.value)} type="number"
            className="border border-slate-300 rounded-md px-2 py-1.5 text-sm" />
        </label>
        <label className="text-xs text-slate-500 flex flex-col gap-1">
          Latitude
          <input value={lat} onChange={(e) => setLat(e.target.value)} type="number" step="0.0001"
            className="border border-slate-300 rounded-md px-2 py-1.5 text-sm" />
        </label>
        <label className="text-xs text-slate-500 flex flex-col gap-1">
          Longitude
          <input value={lng} onChange={(e) => setLng(e.target.value)} type="number" step="0.0001"
            className="border border-slate-300 rounded-md px-2 py-1.5 text-sm" />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {state !== "connected" ? (
          <button onClick={() => connect()} className="px-3 py-1.5 text-sm rounded-md bg-slate-800 text-white hover:bg-slate-700">
            Connect
          </button>
        ) : (
          <button onClick={disconnect} className="px-3 py-1.5 text-sm rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200">
            Disconnect
          </button>
        )}
        <button onClick={sendOnce} disabled={state !== "connected"}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed">
          <Send size={14} /> Send once
        </button>
        <button onClick={toggleSim} disabled={state !== "connected"}
          className={`px-3 py-1.5 text-sm rounded-md disabled:opacity-40 disabled:cursor-not-allowed ${simRunning ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}>
          {simRunning ? "Stop simulation" : "Start simulation (2s tick)"}
        </button>
      </div>

      <LogPanel log={log} onClear={clearLog} />
    </div>
  );
}

function AdminPanel({ baseUrl }) {
  const { state, log, connRef, connect, disconnect, pushLog, clearLog } = usePanelConnection(baseUrl);
  const [locations, setLocations] = useState({});

  const join = async () => {
    const conn = await connect((loc) => {
      setLocations((prev) => ({ ...prev, [loc.busId]: loc }));
    });
    try {
      await conn.invoke("JoinAdminGroup");
      pushLog("Invoked JoinAdminGroup");
    } catch (err) {
      pushLog(`JoinAdminGroup failed: ${err.message}`);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-slate-800">
          <Radio size={18} className="text-emerald-500" />
          Admin monitor
        </div>
        <StatusPill state={state} />
      </div>

      <div className="flex gap-2">
        {state !== "connected" ? (
          <button onClick={join} className="px-3 py-1.5 text-sm rounded-md bg-slate-800 text-white hover:bg-slate-700">
            Connect & join Admins
          </button>
        ) : (
          <button onClick={disconnect} className="px-3 py-1.5 text-sm rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200">
            Disconnect
          </button>
        )}
      </div>

      <div>
        <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Live buses</div>
        {Object.keys(locations).length === 0 ? (
          <div className="text-sm text-slate-400 italic">No locations received yet.</div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {Object.values(locations).map((loc) => (
              <div key={loc.busId} className="flex items-center justify-between text-sm border border-slate-100 rounded-md px-3 py-2 bg-slate-50">
                <span className="font-medium text-slate-700">Bus #{loc.busId}</span>
                <span className="text-slate-500 font-mono text-xs">{loc.latitude.toFixed(5)}, {loc.longitude.toFixed(5)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <LogPanel log={log} onClear={clearLog} />
    </div>
  );
}

function LogPanel({ log, onClear }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs uppercase tracking-wide text-slate-400">Event log</div>
        <button onClick={onClear} className="text-slate-400 hover:text-slate-600">
          <Trash2 size={14} />
        </button>
      </div>
      <div className="h-36 overflow-y-auto bg-slate-900 rounded-md p-2 text-xs font-mono text-emerald-300 flex flex-col-reverse gap-0.5">
        {log.length === 0 && <div className="text-slate-500">No events yet.</div>}
        {log.map((entry) => (
          <div key={entry.id}>
            <span className="text-slate-500">[{entry.time}]</span> {entry.line}
          </div>
        ))}
      </div>
    </div>
  );
}

function TrackingBusPage() {
  const [baseUrl, setBaseUrl] = useState("https://localhost:5001");

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-5">
        <div>
          <h1 className="text-xl font-bold text-slate-800">TrackingHub tester</h1>
          <p className="text-sm text-slate-500 mt-1">
            Simulates a driver client (invokes <code className="bg-slate-100 px-1 rounded">SendBusLocation</code>) and an admin
            client (invokes <code className="bg-slate-100 px-1 rounded">JoinAdminGroup</code>, listens for
            <code className="bg-slate-100 px-1 rounded ml-1">ReceiveBusLocation</code>).
          </p>
        </div>

        <label className="text-xs text-slate-500 flex flex-col gap-1 max-w-sm">
          API base URL
          <input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)}
            className="border border-slate-300 rounded-md px-2 py-1.5 text-sm font-mono" />
          <span className="text-[11px] text-slate-400">Hub path appended: {HUB_PATH} — update in code if your MapHub route differs.</span>
        </label>

        <div className="grid md:grid-cols-2 gap-5">
          <DriverPanel baseUrl={baseUrl} />
          <AdminPanel baseUrl={baseUrl} />
        </div>
      </div>
    </div>
  );
}


export default TrackingBusPage