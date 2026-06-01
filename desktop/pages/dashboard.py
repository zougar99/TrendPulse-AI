from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from desktop.api_client import *
import random

class DashboardPage(QWidget):
    page_title = "Dashboard"

    def __init__(self):
        super().__init__()
        self.setObjectName("dashboardPage")
        layout = QVBoxLayout(self)
        layout.setContentsMargins(24, 24, 24, 24)
        layout.setSpacing(16)

        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setObjectName("contentArea")
        scroll.setFrameShape(QFrame.Shape.NoFrame)
        scroll_widget = QWidget()
        scroll_widget.setObjectName("scrollWidget")
        scroll_layout = QVBoxLayout(scroll_widget)
        scroll_layout.setContentsMargins(0, 0, 0, 0)
        scroll_layout.setSpacing(16)

        header = QHBoxLayout()
        title = QLabel("Dashboard")
        title.setObjectName("titleLabel")
        status = QLabel("●  LIVE")
        status.setObjectName("glowText")
        status.setStyleSheet("color: #00FF88; font-size: 12px;")
        header.addWidget(title)
        header.addStretch()
        header.addWidget(status)
        scroll_layout.addLayout(header)

        cards_layout = QHBoxLayout()
        cards_layout.setSpacing(12)
        metrics = [
            ("Keywords Tracked", str(random.randint(1200, 3500)), "#00BFFF"),
            ("Pages Analyzed", str(random.randint(400, 1200)), "#8A5CFF"),
            ("Viral Detected", str(random.randint(50, 200)), "#FF2D95"),
            ("Trends Found", str(random.randint(80, 300)), "#00FF88"),
        ]
        self.stat_labels = {}
        for label, value, color in metrics:
            card = QFrame()
            card.setObjectName("statCard")
            card.setStyleSheet(f"""
                QFrame#statCard {{
                    background: rgba(18,18,26,0.85);
                    border: 1px solid rgba(255,255,255,0.04);
                    border-radius: 10px;
                    padding: 16px;
                    border-top: 2px solid {color};
                }}
            """)
            card.setMinimumHeight(120)
            card_layout = QVBoxLayout(card)
            card_layout.setContentsMargins(16, 16, 16, 16)
            val = QLabel(value)
            val.setObjectName("cardValue")
            val.setStyleSheet(f"font-size: 28px; font-weight: 700; color: {color};")
            self.stat_labels[label] = val
            lbl = QLabel(label)
            lbl.setObjectName("cardLabel")
            lbl.setStyleSheet("font-size: 10px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px;")
            card_layout.addWidget(val)
            card_layout.addWidget(lbl)
            cards_layout.addWidget(card)
        scroll_layout.addLayout(cards_layout)

        mid_layout = QHBoxLayout()
        mid_layout.setSpacing(16)

        feed_card = QFrame()
        feed_card.setObjectName("feedCard")
        feed_card.setStyleSheet("QFrame#feedCard { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        feed_layout = QVBoxLayout(feed_card)
        feed_title = QLabel("Activity Feed")
        feed_title.setObjectName("cardTitle")
        feed_layout.addWidget(feed_title)
        self.feed_list = QListWidget()
        self.feed_list.setMaximumHeight(200)
        feed_layout.addWidget(self.feed_list)
        mid_layout.addWidget(feed_card, 2)

        actions_card = QFrame()
        actions_card.setObjectName("actionsCard")
        actions_card.setStyleSheet("QFrame#actionsCard { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        actions_layout = QVBoxLayout(actions_card)
        actions_title = QLabel("Quick Actions")
        actions_title.setObjectName("cardTitle")
        actions_layout.addWidget(actions_title)
        btn1 = QPushButton("Analyze Page")
        btn1.setObjectName("btnPrimary")
        btn1.clicked.connect(lambda: QInputDialog.getText(self, "Analyze Page", "Enter page URL:"))
        btn2 = QPushButton("Scan Keyword")
        btn2.setObjectName("btnPrimary")
        btn2.clicked.connect(lambda: QInputDialog.getText(self, "Scan Keyword", "Enter keyword to scan:"))
        btn3 = QPushButton("Generate Content")
        btn3.setObjectName("btnAccent")
        btn3.clicked.connect(lambda: QMessageBox.information(self, "Content Generator", "Open the Content Generator tab for full AI content creation tools."))
        actions_layout.addWidget(btn1)
        actions_layout.addWidget(btn2)
        actions_layout.addWidget(btn3)
        actions_layout.addStretch()
        mid_layout.addWidget(actions_card, 1)

        scroll_layout.addLayout(mid_layout)
        scroll.setWidget(scroll_widget)
        layout.addWidget(scroll)

        self.load_feed()

    def load_feed(self):
        actions = [
            "Trend spike detected in AI tools niche",
            "New keyword opportunity: python tutorial",
            "Viral content identified in gaming",
            "Competitor channel growth: +12%",
            "Early trend: machine learning basics",
            "Content scheduled for tomorrow",
            "Niche profitability updated",
            "Keyword 'crypto news' gaining momentum"
        ]
        for a in actions:
            self.feed_list.addItem(a)
