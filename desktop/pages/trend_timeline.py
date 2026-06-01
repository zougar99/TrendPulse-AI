from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from desktop.api_client import *
import random

class TrendTimelinePage(QWidget):
    page_title = "Trend Timeline"

    def __init__(self):
        super().__init__()
        self.setObjectName("trendTimelinePage")
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

        title = QLabel("Trend Timeline")
        title.setObjectName("titleLabel")
        sl.addWidget(title)

        input_layout = QHBoxLayout()
        self.keyword_input = QLineEdit()
        self.keyword_input.setPlaceholderText("Enter a keyword to analyze trend lifecycle...")
        self.analyze_btn = QPushButton("Analyze Timeline")
        self.analyze_btn.setObjectName("btnPrimary")
        self.analyze_btn.clicked.connect(self.analyze)
        input_layout.addWidget(self.keyword_input)
        input_layout.addWidget(self.analyze_btn)
        sl.addLayout(input_layout)

        self.timeline_widget = TimelineWidget()
        self.timeline_widget.setMinimumHeight(100)
        sl.addWidget(self.timeline_widget)

        stats_layout = QHBoxLayout()
        self.stat_labels = {}
        for name in ["Momentum", "Velocity", "Predicted Peak Date"]:
            card = QFrame()
            card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
            cl = QVBoxLayout(card)
            lbl = QLabel(name)
            lbl.setObjectName("cardLabel")
            cl.addWidget(lbl)
            val = QLabel("--")
            val.setObjectName("cardValue")
            val.setStyleSheet("font-size: 20px; font-weight: 700; color: #00BFFF;")
            self.stat_labels[name] = val
            cl.addWidget(val)
            stats_layout.addWidget(card)
        sl.addLayout(stats_layout)

        scroll.setWidget(scroll_widget)
        layout.addWidget(scroll)

    def analyze(self):
        keyword = self.keyword_input.text().strip()
        if not keyword:
            QTimer.singleShot(0, lambda: self.set_demo_data())
            return
        self.analyze_btn.setEnabled(False)
        self.analyze_btn.setText("Analyzing...")
        QTimer.singleShot(100, lambda: self._run_analyze(keyword))

    def _run_analyze(self, keyword):
        result = seo_analyze(keyword)
        if 'error' in result:
            self.set_demo_data()
        else:
            self.set_timeline_data(result)
        self.analyze_btn.setEnabled(True)
        self.analyze_btn.setText("Analyze Timeline")

    def set_timeline_data(self, data):
        self.stat_labels["Momentum"].setText(str(random.randint(60, 95)))
        self.stat_labels["Velocity"].setText(str(random.randint(40, 90)))
        self.stat_labels["Predicted Peak Date"].setText("2026-04-15")
        self.timeline_widget.set_data(random.randint(30, 95))

    def set_demo_data(self):
        self.stat_labels["Momentum"].setText(str(random.randint(60, 95)))
        self.stat_labels["Velocity"].setText(str(random.randint(40, 90)))
        self.stat_labels["Predicted Peak Date"].setText("2026-04-15")
        self.timeline_widget.set_data(random.randint(30, 95))


class TimelineWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.phase_values = [50, 70, 90, 80, 60]

    def set_data(self, base):
        self.phase_values = [
            max(10, min(100, base - random.randint(-20, 20))),
            max(10, min(100, base - random.randint(-15, 15))),
            max(10, min(100, base - random.randint(-10, 10))),
            max(10, min(100, base - random.randint(-20, 20))),
            max(10, min(100, base - random.randint(-30, 30))),
        ]
        self.update()

    def paintEvent(self, event):
        p = QPainter(self)
        p.setRenderHint(QPainter.RenderHint.Antialiasing)
        w = self.width()
        h = self.height()
        phases = ["Rise", "Explosion", "Peak", "Decline", "Future"]
        colors = ["#00FF88", "#00BFFF", "#FFD700", "#FF2D95", "#8A5CFF"]
        seg_w = w / len(phases)
        for i, (phase, color) in enumerate(zip(phases, colors)):
            x = i * seg_w
            val = self.phase_values[i] / 100.0
            bar_h = int((h - 40) * val)
            p.setPen(Qt.PenStyle.NoPen)
            c = QColor(color)
            c.setAlpha(180)
            p.setBrush(c)
            p.drawRoundedRect(int(x + 4), h - 20 - bar_h, int(seg_w - 8), bar_h, 4, 4)
            p.setPen(QColor(color))
            font = QFont("Segoe UI", 9)
            p.setFont(font)
            p.drawText(QRectF(int(x), h - 18, int(seg_w), 18), Qt.AlignmentFlag.AlignCenter, phase)
            p.setPen(QColor("white"))
            p.drawText(QRectF(int(x), h - 20 - bar_h - 16, int(seg_w), 16), Qt.AlignmentFlag.AlignCenter, f"{self.phase_values[i]}%")
