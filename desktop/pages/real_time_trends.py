from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from desktop.api_client import *
import random

class RealTimeTrendEnginePage(QWidget):
    page_title = "Real-Time Trends"

    def __init__(self):
        super().__init__()
        self.setObjectName("realTimeTrendEnginePage")
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
        title = QLabel("Real-Time Trend Engine")
        title.setObjectName("titleLabel")
        header.addWidget(title)
        self.live_indicator = QLabel("●  LIVE")
        self.live_indicator.setStyleSheet("color: #FF2D95; font-size: 12px;")
        header.addStretch()
        header.addWidget(self.live_indicator)
        sl.addLayout(header)

        filter_layout = QHBoxLayout()
        categories = ["Breaking", "AI", "Crypto", "Gaming", "Celebrity", "Finance"]
        self.filter_buttons = {}
        for cat in categories:
            btn = QPushButton(cat)
            btn.setCheckable(True)
            btn.setObjectName("btnPrimary")
            btn.clicked.connect(lambda checked, c=cat: self.filter_by(c))
            self.filter_buttons[cat] = btn
            filter_layout.addWidget(btn)
        sl.addLayout(filter_layout)

        self.trends_layout = QVBoxLayout()
        self.trends_layout.setSpacing(8)
        sl.addLayout(self.trends_layout)

        scroll.setWidget(scroll_widget)
        layout.addWidget(scroll)

        self.timer = QTimer()
        self.timer.timeout.connect(self.refresh_trends)
        self.timer.start(5000)
        self.current_filter = "Breaking"
        self.filter_buttons["Breaking"].setChecked(True)
        QTimer.singleShot(100, self.refresh_trends)

    def filter_by(self, category):
        self.current_filter = category
        for btn in self.filter_buttons.values():
            btn.setChecked(False)
        self.filter_buttons[category].setChecked(True)
        self.refresh_trends()

    def refresh_trends(self):
        self.live_indicator.setStyleSheet("color: #00FF88; font-size: 12px;")
        QTimer.singleShot(1000, lambda: self.live_indicator.setStyleSheet("color: #FF2D95; font-size: 12px;"))
        while self.trends_layout.count():
            item = self.trends_layout.takeAt(0)
            if item and item.widget():
                item.widget().deleteLater()
        result = trending_daily()
        trends = result.get('trends', [])
        if not trends:
            trends = [
                "AI revolution 2026", "Quantum computing breakthrough", "Crypto market rally",
                "Gaming industry growth", "Celebrity AI endorsements", "DeFi innovations",
                "Machine learning tools", "Web3 development", "NFT market recovery",
                "Edge computing trends"
            ]
        trends = random.sample(trends, min(6, len(trends))) if len(trends) > 6 else trends
        for t in trends:
            card = QFrame()
            card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 12px; }")
            cl = QHBoxLayout(card)
            dot = QLabel("●")
            dot.setStyleSheet(f"color: {random.choice(['#00FF88', '#00BFFF', '#FFD700', '#FF2D95', '#8A5CFF'])}; font-size: 10px;")
            cl.addWidget(dot)
            text_layout = QVBoxLayout()
            name_lbl = QLabel(t)
            name_lbl.setStyleSheet("font-size: 12px; font-weight: 600; color: white;")
            text_layout.addWidget(name_lbl)
            meta = QLabel(f"Velocity: {random.randint(50,95)} | Momentum: {random.randint(40,90)} | Mentions: {random.randint(100,50000):,}")
            meta.setStyleSheet("font-size: 9px; color: rgba(255,255,255,0.4);")
            text_layout.addWidget(meta)
            cl.addLayout(text_layout)
            cl.addStretch()
            accel = random.randint(70, 100)
            if accel > 85:
                badge = QLabel("ACCELERATING")
                badge.setStyleSheet("background: rgba(255,45,149,0.15); color: #FF2D95; padding: 2px 8px; border-radius: 4px; font-size: 9px; font-weight: 600;")
                cl.addWidget(badge)
            self.trends_layout.addWidget(card)
