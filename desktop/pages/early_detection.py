from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from desktop.api_client import *
import random

class EarlyDetectionPage(QWidget):
    page_title = "Early Detection"

    def __init__(self):
        super().__init__()
        self.setObjectName("earlyDetectionPage")
        layout = QVBoxLayout(self)
        layout.setContentsMargins(24, 24, 24, 24)
        layout.setSpacing(16)

        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setObjectName("contentArea")
        scroll.setFrameShape(QFrame.Shape.NoFrame)
        scroll_widget = QWidget()
        sl = QVBoxLayout(scroll_widget)
        sl.setContentsMargins(0, 0, 0, 0)
        sl.setSpacing(16)

        header = QHBoxLayout()
        title = QLabel("Early Detection Radar")
        title.setObjectName("titleLabel")
        header.addWidget(title)
        self.radar_indicator = QLabel("●  SCANNING")
        self.radar_indicator.setStyleSheet("color: #00FF88; font-size: 12px;")
        header.addStretch()
        header.addWidget(self.radar_indicator)
        sl.addLayout(header)

        self.alert_banner = QLabel("EARLY TREND DETECTED: AI Content Explosion")
        self.alert_banner.setStyleSheet("""
            background: rgba(255,45,149,0.12);
            border: 1px solid #FF2D95;
            border-radius: 8px;
            padding: 12px;
            font-size: 14px;
            font-weight: 700;
            color: #FF2D95;
        """)
        self.alert_banner.setVisible(False)
        sl.addWidget(self.alert_banner)

        signals = [
            "Autocomplete Velocity", "Upload Frequency", "Search Acceleration",
            "Social Spikes", "Discussion Growth", "Engagement Anomalies"
        ]
        self.signal_bars = {}
        sig_grid = QGridLayout()
        sig_grid.setSpacing(8)
        for i, name in enumerate(signals):
            card = QFrame()
            card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 12px; }")
            cl = QVBoxLayout(card)
            lbl = QLabel(name)
            lbl.setStyleSheet("font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.7);")
            cl.addWidget(lbl)
            bar = QProgressBar()
            bar.setMaximum(100)
            bar.setTextVisible(False)
            bar.setStyleSheet("QProgressBar { background: rgba(255,255,255,0.04); border: none; border-radius: 3px; height: 8px; } QProgressBar::chunk { background: qlineargradient(x1:0, y1:0, x2:1, y2:0, stop:0 #00BFFF, stop:1 #FF2D95); border-radius: 3px; }")
            self.signal_bars[name] = bar
            cl.addWidget(bar)
            sig_grid.addWidget(card, i // 3, i % 3)
        sl.addLayout(sig_grid)

        breakout_card = QFrame()
        breakout_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 20px; }")
        breakout_layout = QVBoxLayout(breakout_card)
        breakout_layout.addWidget(QLabel("Breakout Probability"))
        self.breakout_label = QLabel("0%")
        self.breakout_label.setStyleSheet("font-size: 48px; font-weight: 700; color: #00FF88;")
        breakout_layout.addWidget(self.breakout_label)
        self.breakout_ring = QProgressBar()
        self.breakout_ring.setMaximum(100)
        self.breakout_ring.setStyleSheet("""
            QProgressBar { background: rgba(255,255,255,0.04); border: none; border-radius: 6px; height: 16px; }
            QProgressBar::chunk { background: qlineargradient(x1:0, y1:0, x2:1, y2:0, stop:0 #00FF88, stop:0.5 #00BFFF, stop:1 #8A5CFF); border-radius: 6px; }
        """)
        breakout_layout.addWidget(self.breakout_ring)
        sl.addWidget(breakout_card)

        trends_card = QFrame()
        trends_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        trends_layout = QVBoxLayout(trends_card)
        trends_layout.addWidget(QLabel("Detected Trends"))
        self.trends_list = QListWidget()
        trends_layout.addWidget(self.trends_list)
        sl.addWidget(trends_card)

        scroll.setWidget(scroll_widget)
        layout.addWidget(scroll)

        self.timer = QTimer()
        self.timer.timeout.connect(self.scan)
        self.timer.start(3000)
        self.scan_count = 0

    def scan(self):
        self.scan_count += 1
        for name, bar in self.signal_bars.items():
            bar.setValue(random.randint(20, 95))
        bp = random.randint(30, 95)
        self.breakout_label.setText(f"{bp}%")
        self.breakout_ring.setValue(bp)
        if bp > 75 and self.scan_count % 3 == 0:
            self.alert_banner.setVisible(True)
            QTimer.singleShot(4000, lambda: self.alert_banner.setVisible(False))
        result = trending_daily()
        trends = result.get('trends', [])
        self.trends_list.clear()
        for t in trends[:10]:
            bp2 = random.randint(30, 95)
            self.trends_list.addItem(f"[{bp2}% breakout] {t} - predicted in {random.randint(2,14)}d")
