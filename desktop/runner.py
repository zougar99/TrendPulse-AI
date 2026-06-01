#!/usr/bin/env python3
"""TrendPulse AI Desktop — entry point. Starts backend API server then launches the PyQt6 GUI."""

import sys, os, subprocess, time, signal, atexit

SERVER_PROCESS = None

def start_server():
    global SERVER_PROCESS
    app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    server_script = os.path.join(app_dir, "app.py")
    if not os.path.exists(server_script):
        print(f"[TrendPulse] Server script not found at {server_script}")
        print("[TrendPulse] Continuing with demo data...")
        return
    try:
        SERVER_PROCESS = subprocess.Popen(
            [sys.executable, server_script],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            cwd=app_dir
        )
        print(f"[TrendPulse] API server started (PID {SERVER_PROCESS.pid})")
        time.sleep(2)
    except Exception as e:
        print(f"[TrendPulse] Failed to start server: {e}")

def stop_server():
    global SERVER_PROCESS
    if SERVER_PROCESS and SERVER_PROCESS.poll() is None:
        SERVER_PROCESS.terminate()
        try:
            SERVER_PROCESS.wait(timeout=5)
        except:
            SERVER_PROCESS.kill()
        print(f"[TrendPulse] API server stopped")

def main():
    atexit.register(stop_server)
    signal.signal(signal.SIGINT, lambda s, f: sys.exit(0))
    signal.signal(signal.SIGTERM, lambda s, f: sys.exit(0))

    print("=" * 60)
    print("  TrendPulse AI — Intelligence Engine")
    print("=" * 60)
    start_server()

    from desktop.main_window import launch_desktop
    launch_desktop()

if __name__ == "__main__":
    main()
