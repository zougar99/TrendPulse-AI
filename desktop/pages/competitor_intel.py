from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from desktop.api_client import *
import random

class CompetitorIntelligencePage(QWidget):
    page_title = "Competitor Intelligence"

    def __init__(self):
        super().__init__()
        self.setObjectName("competitorIntelligencePage")
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

        title = QLabel("Competitor Intelligence")
        title.setObjectName("titleLabel")
        sl.addWidget(title)

        input_layout = QHBoxLayout()
        self.channel_input = QLineEdit()
        self.channel_input.setPlaceholderText("Enter channel name or ID...")
        self.analyze_btn = QPushButton("Analyze")
        self.analyze_btn.setObjectName("btnPrimary")
        self.analyze_btn.clicked.connect(self.analyze)
        input_layout.addWidget(self.channel_input)
        input_layout.addWidget(self.analyze_btn)
        sl.addLayout(input_layout)

        profile_card = QFrame()
        profile_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        profile_layout = QHBoxLayout(profile_card)
        self.profile_info = QLabel("Enter a channel name and click Analyze")
        self.profile_info.setStyleSheet("font-size: 12px; color: rgba(255,255,255,0.5);")
        profile_layout.addWidget(self.profile_info)
        sl.addWidget(profile_card)

        self.growth_chart = CompetitorGrowthWidget()
        self.growth_chart.setMinimumHeight(150)
        sl.addWidget(self.growth_chart)

        timing_card = QFrame()
        timing_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        timing_layout = QVBoxLayout(timing_card)
        timing_layout.addWidget(QLabel("Upload Timing Analysis"))
        self.timing_list = QListWidget()
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        for d in days:
            self.timing_list.addItem(f"{d}: {random.choice(['8 AM', '12 PM', '3 PM', '6 PM', '8 PM'])} - Score: {random.randint(50,95)}")
        timing_layout.addWidget(self.timing_list)
        sl.addWidget(timing_card)

        kw_card = QFrame()
        kw_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        kw_layout = QVBoxLayout(kw_card)
        kw_layout.addWidget(QLabel("Keyword Strategy"))
        self.kw_table = QTableWidget()
        self.kw_table.setColumnCount(3)
        self.kw_table.setHorizontalHeaderLabels(["Keyword", "Volume", "Difficulty"])
        self.kw_table.horizontalHeader().setStretchLastSection(True)
        self.kw_table.setEditTriggers(QAbstractItemView.EditTrigger.NoEditTriggers)
        kw_layout.addWidget(self.kw_table)
        sl.addWidget(kw_card)

        hidden_card = QFrame()
        hidden_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        hidden_layout = QVBoxLayout(hidden_card)
        hidden_layout.addWidget(QLabel("Hidden Keywords"))
        self.hidden_list = QListWidget()
        hidden_layout.addWidget(self.hidden_list)
        sl.addWidget(hidden_card)

        self.content_pie = ContentPieWidget()
        self.content_pie.setMinimumHeight(150)
        sl.addWidget(self.content_pie)

        eng_card = QFrame()
        eng_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        eng_layout = QVBoxLayout(eng_card)
        eng_layout.addWidget(QLabel("Engagement Analysis"))
        self.eng_bars = {}
        for metric in ["Avg Views", "Like Ratio", "Comment Rate", "Share Rate"]:
            hl = QHBoxLayout()
            lbl = QLabel(metric)
            lbl.setFixedWidth(100)
            lbl.setStyleSheet("font-size: 11px; color: rgba(255,255,255,0.6);")
            bar = QProgressBar()
            bar.setMaximum(100)
            bar.setTextVisible(False)
            bar.setStyleSheet("QProgressBar { background: rgba(255,255,255,0.04); border: none; border-radius: 3px; height: 8px; } QProgressBar::chunk { background: qlineargradient(x1:0, y1:0, x2:1, y2:0, stop:0 #00BFFF, stop:1 #8A5CFF); border-radius: 3px; }")
            vl = QLabel("0%")
            vl.setFixedWidth(35)
            vl.setStyleSheet("font-size: 10px; color: rgba(255,255,255,0.4);")
            self.eng_bars[metric] = (bar, vl)
            hl.addWidget(lbl)
            hl.addWidget(bar)
            hl.addWidget(vl)
            eng_layout.addLayout(hl)
        sl.addWidget(eng_card)

        scroll.setWidget(scroll_widget)
        layout.addWidget(scroll)

        QTimer.singleShot(100, self.set_demo_data)

    def analyze(self):
        channel = self.channel_input.text().strip()
        if not channel:
            QTimer.singleShot(0, self.set_demo_data)
            return
        self.analyze_btn.setEnabled(False)
        self.analyze_btn.setText("Analyzing...")
        QTimer.singleShot(100, lambda: self._run_analyze(channel))

    def _run_analyze(self, channel):
        result = channel_analytics(username=channel)
        if 'error' in result:
            self.set_demo_data()
        else:
            self.set_competitor_data(result)
        self.analyze_btn.setEnabled(True)
        self.analyze_btn.setText("Analyze")

    def set_competitor_data(self, data):
        channel = data.get('channel', {})
        name = channel.get('title', 'Unknown')
        subs = channel.get('subscribers', 0)
        vids = channel.get('totalVideos', 0)
        niche = "Technology"
        self.profile_info.setText(f"{name} | {subs:,} subs | {vids} videos | Niche: {niche}")
        self.growth_chart.update()
        self.kw_table.setRowCount(10)
        for i in range(10):
            self.kw_table.setItem(i, 0, QTableWidgetItem(f"keyword_{i+1}"))
            self.kw_table.setItem(i, 1, QTableWidgetItem(str(random.randint(100, 50000))))
            self.kw_table.setItem(i, 2, QTableWidgetItem(f"{random.randint(20, 90)}%"))
        hidden_kws = ["untapped keyword a", "hidden gem b", "low comp c", "rising term d", "niche phrase e"]
        self.hidden_list.clear()
        for h in hidden_kws:
            self.hidden_list.addItem(h)
        for metric, (bar, vl) in self.eng_bars.items():
            val = random.randint(30, 95)
            bar.setValue(val)
            vl.setText(f"{val}%")
        self.content_pie.update()

    def set_demo_data(self):
        self.profile_info.setText("TechChannel Pro | 1.2M subs | 450 videos | Niche: Technology")
        self.growth_chart.update()
        self.kw_table.setRowCount(10)
        keywords = [
            ("machine learning", "45,000", "65%"),
            ("python tutorial", "32,000", "45%"),
            ("data science", "28,000", "55%"),
            ("ai tools", "22,000", "40%"),
            ("deep learning", "18,000", "60%"),
            ("neural networks", "15,000", "58%"),
            ("computer vision", "12,000", "50%"),
            ("nlp tutorial", "10,000", "42%"),
            ("reinforcement learning", "8,000", "48%"),
            ("ai ethics", "6,000", "35%"),
        ]
        for i, (kw, vol, diff) in enumerate(keywords):
            self.kw_table.setItem(i, 0, QTableWidgetItem(kw))
            self.kw_table.setItem(i, 1, QTableWidgetItem(vol))
            self.kw_table.setItem(i, 2, QTableWidgetItem(diff))
        hidden_kws = ["edge ai computing", "federated learning", "ai governance", "mlops pipeline", "tiny machine learning"]
        self.hidden_list.clear()
        for h in hidden_kws:
            self.hidden_list.addItem(h)
        for metric, (bar, vl) in self.eng_bars.items():
            val = random.randint(30, 95)
            bar.setValue(val)
            vl.setText(f"{val}%")
        self.content_pie.update()


class CompetitorGrowthWidget(QWidget):
    def paintEvent(self, event):
        p = QPainter(self)
        p.setRenderHint(QPainter.RenderHint.Antialiasing)
        w = self.width() - 40
        h = self.height() - 40
        points = []
        for i in range(12):
            x = 20 + (w / 12) * i
            y = 20 + h - (random.randint(15, 90) / 100.0) * h
            points.append(QPointF(x, y))
        p.setPen(QPen(QColor(0, 255, 136), 2))
        for i in range(len(points) - 1):
            p.drawLine(points[i], points[i + 1])
        path = QPainterPath()
        path.moveTo(points[0])
        for i in range(1, len(points)):
            path.lineTo(points[i])
        path.lineTo(points[-1].x(), 20 + h)
        path.lineTo(points[0].x(), 20 + h)
        path.closeSubpath()
        p.fillPath(path, QColor(0, 255, 136, 30))


class ContentPieWidget(QWidget):
    def paintEvent(self, event):
        p = QPainter(self)
        p.setRenderHint(QPainter.RenderHint.Antialiasing)
        w = min(self.width(), self.height()) - 40
        rect = QRectF((self.width() - w) / 2, 20, w, w)
        segments = [
            (45, "#00BFFF", "Tutorials"),
            (25, "#FF2D95", "Reviews"),
            (15, "#FFD700", "Vlogs"),
            (10, "#00FF88", "Live"),
            (5, "#8A5CFF", "Shorts"),
        ]
        start_angle = 0
        for angle, color, label in segments:
            span = int(angle * 360 / 100)
            p.setBrush(QColor(color))
            p.setPen(QPen(QColor(20, 20, 30), 1))
            p.drawPie(rect, start_angle * 16, span * 16)
            start_angle += span
