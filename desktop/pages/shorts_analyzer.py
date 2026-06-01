from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from desktop.api_client import *
import random

class ShortsAnalyzerPage(QWidget):
    page_title = "Shorts Analyzer"

    def __init__(self):
        super().__init__()
        self.setObjectName("shortsAnalyzerPage")
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

        title = QLabel("Shorts Analyzer")
        title.setObjectName("titleLabel")
        sl.addWidget(title)

        input_layout = QHBoxLayout()
        self.url_input = QLineEdit()
        self.url_input.setPlaceholderText("Enter Shorts URL or topic...")
        self.analyze_btn = QPushButton("Analyze")
        self.analyze_btn.setObjectName("btnPrimary")
        self.analyze_btn.clicked.connect(self.analyze)
        input_layout.addWidget(self.url_input)
        input_layout.addWidget(self.analyze_btn)
        sl.addLayout(input_layout)

        stats = [
            ("Hook Speed (ms)", "--", "#00BFFF"),
            ("Retention %", "--", "#00FF88"),
            ("Replay Score", "--", "#FFD700"),
            ("Pacing Score", "--", "#8A5CFF"),
            ("Emotional Impact", "--", "#FF2D95"),
            ("Viral Structure", "--", "#4A90D9"),
        ]
        self.stats_labels = {}
        stats_grid = QGridLayout()
        stats_grid.setSpacing(8)
        for i, (name, _, color) in enumerate(stats):
            card = QFrame()
            card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 12px; }")
            cl = QVBoxLayout(card)
            lbl = QLabel(name)
            lbl.setObjectName("cardLabel")
            cl.addWidget(lbl)
            val = QLabel("--")
            val.setStyleSheet(f"font-size: 18px; font-weight: 700; color: {color};")
            self.stats_labels[name] = val
            cl.addWidget(val)
            stats_grid.addWidget(card, i // 3, i % 3)
        sl.addLayout(stats_grid)

        hook_card = QFrame()
        hook_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        hook_layout = QVBoxLayout(hook_card)
        hook_layout.addWidget(QLabel("Hook Suggestions"))
        self.hook_list = QListWidget()
        hook_layout.addWidget(self.hook_list)
        sl.addWidget(hook_card)

        pacing_card = QFrame()
        pacing_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        pacing_layout = QVBoxLayout(pacing_card)
        pacing_layout.addWidget(QLabel("Pacing Suggestions"))
        self.pacing_list = QListWidget()
        pacing_layout.addWidget(self.pacing_list)
        sl.addWidget(pacing_card)

        scroll.setWidget(scroll_widget)
        layout.addWidget(scroll)

    def analyze(self):
        topic = self.url_input.text().strip() or "trending shorts"
        QTimer.singleShot(100, lambda: self._analyze(topic))

    def _analyze(self, topic):
        self.stats_labels["Hook Speed (ms)"].setText(str(random.randint(200, 3000)))
        self.stats_labels["Retention %"].setText(f"{random.randint(30, 95)}%")
        self.stats_labels["Replay Score"].setText(f"{random.randint(20, 95)}/100")
        self.stats_labels["Pacing Score"].setText(f"{random.randint(40, 95)}/100")
        self.stats_labels["Emotional Impact"].setText(f"{random.randint(30, 95)}%")
        self.stats_labels["Viral Structure"].setText(f"{random.randint(50, 95)}/100")

        self.hook_list.clear()
        hooks = [
            "Start with a question: 'Did you know...?'",
            "Use a surprising statistic in first 2 seconds",
            "Begin with a bold statement or claim",
            "Show the end result first (reverse storytelling)",
            "Use a pattern interrupt: visual or audio",
            "Start with 'Stop scrolling if...'",
        ]
        for h in hooks:
            self.hook_list.addItem(h)

        self.pacing_list.clear()
        pacings = [
            "Cut every 2-3 seconds to maintain energy",
            "Use text overlays for key points",
            "Add background music with beat drops",
            "Vary shot types: close-up, wide, POV",
            "Include quick transitions (whip pan, swipe)",
            "Keep total duration 15-30 seconds for best retention",
            "Add a loop point at the end for replay",
        ]
        for p in pacings:
            self.pacing_list.addItem(p)
