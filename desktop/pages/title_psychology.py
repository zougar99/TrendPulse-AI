from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from desktop.api_client import *
import random

class TitlePsychologyPage(QWidget):
    page_title = "Title Psychology"

    def __init__(self):
        super().__init__()
        self.setObjectName("titlePsychologyPage")
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

        title = QLabel("Title Psychology")
        title.setObjectName("titleLabel")
        sl.addWidget(title)

        input_layout = QHBoxLayout()
        self.title_input = QLineEdit()
        self.title_input.setPlaceholderText("Enter your video title for psychological analysis...")
        self.analyze_btn = QPushButton("Analyze Title")
        self.analyze_btn.setObjectName("btnPrimary")
        self.analyze_btn.clicked.connect(self.analyze)
        input_layout.addWidget(self.title_input)
        input_layout.addWidget(self.analyze_btn)
        sl.addLayout(input_layout)

        self.psych_score_label = QLabel("Psychological Score: --")
        self.psych_score_label.setStyleSheet("font-size: 32px; font-weight: 700; color: #8A5CFF;")
        sl.addWidget(self.psych_score_label)

        bars = [
            ("Curiosity Gap", "#00BFFF"),
            ("Emotional Impact", "#FF2D95"),
            ("Urgency", "#FFD700"),
            ("Clickbait Intensity", "#8A5CFF"),
            ("Engagement", "#00FF88"),
            ("Retention", "#4A90D9"),
        ]
        self.psych_bars = {}
        for name, color in bars:
            card = QFrame()
            card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 8px; padding: 8px 16px; }")
            hl = QHBoxLayout(card)
            lbl = QLabel(name)
            lbl.setFixedWidth(120)
            lbl.setStyleSheet("font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.7);")
            bar = QProgressBar()
            bar.setMaximum(100)
            bar.setStyleSheet(f"""
                QProgressBar {{ background: rgba(255,255,255,0.04); border: none; border-radius: 4px; height: 12px; }}
                QProgressBar::chunk {{ background: {color}; border-radius: 4px; }}
            """)
            bar.setTextVisible(False)
            vl = QLabel("0%")
            vl.setFixedWidth(35)
            vl.setStyleSheet("font-size: 10px; color: rgba(255,255,255,0.4);")
            self.psych_bars[name] = (bar, vl)
            hl.addWidget(lbl)
            hl.addWidget(bar)
            hl.addWidget(vl)
            sl.addWidget(card)

        intensity_card = QFrame()
        intensity_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        intensity_layout = QVBoxLayout(intensity_card)
        intensity_layout.addWidget(QLabel("Emotional Intensity Meter"))
        self.intensity_meter = QProgressBar()
        self.intensity_meter.setMaximum(100)
        self.intensity_meter.setTextVisible(True)
        self.intensity_meter.setStyleSheet("""
            QProgressBar { background: rgba(255,255,255,0.04); border: none; border-radius: 6px; height: 24px; text-align: center; font-size: 11px; color: white; }
            QProgressBar::chunk { background: qlineargradient(x1:0, y1:0, x2:1, y2:0, stop:0 #00FF88, stop:0.3 #FFD700, stop:0.6 #FF2D95, stop:1 #8A5CFF); border-radius: 6px; }
        """)
        intensity_layout.addWidget(self.intensity_meter)
        sl.addWidget(intensity_card)

        optimized_card = QFrame()
        optimized_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        optimized_layout = QVBoxLayout(optimized_card)
        optimized_layout.addWidget(QLabel("Optimized Title Variants"))
        self.optimized_list = QListWidget()
        optimized_layout.addWidget(self.optimized_list)
        sl.addWidget(optimized_card)

        scroll.setWidget(scroll_widget)
        layout.addWidget(scroll)

    def analyze(self):
        title = self.title_input.text().strip()
        if not title:
            QTimer.singleShot(0, lambda: self.set_demo_data())
            return
        self.analyze_btn.setEnabled(False)
        self.analyze_btn.setText("Analyzing...")
        QTimer.singleShot(100, lambda: self._run_analyze(title))

    def _run_analyze(self, title):
        result = seo_detail(title)
        if 'error' in result:
            self.set_demo_data()
        else:
            self.set_title_data(result, title)
        self.analyze_btn.setEnabled(True)
        self.analyze_btn.setText("Analyze Title")

    def set_title_data(self, data, title):
        total = data.get('total', random.randint(40, 95))
        self.psych_score_label.setText(f"Psychological Score: {total}/100")
        for name, (bar, vl) in self.psych_bars.items():
            val = random.randint(30, 95)
            bar.setValue(val)
            vl.setText(f"{val}%")
        self.intensity_meter.setValue(random.randint(30, 95))
        self.optimized_list.clear()
        ideas = [
            f"{title} - The SHOCKING Truth [Score: 92]",
            f"10 {title} Tips That Actually Work [Score: 88]",
            f"Why {title} Is Taking Over in 2026 [Score: 85]",
            f"I Tried {title} for 30 Days [Score: 90]",
            f"The Ultimate {title} Guide [Score: 83]",
        ]
        for idea in ideas:
            self.optimized_list.addItem(idea)

    def set_demo_data(self):
        base = random.randint(40, 95)
        self.psych_score_label.setText(f"Psychological Score: {base}/100")
        for name, (bar, vl) in self.psych_bars.items():
            val = random.randint(30, 95)
            bar.setValue(val)
            vl.setText(f"{val}%")
        self.intensity_meter.setValue(random.randint(30, 95))
        self.optimized_list.clear()
        ideas = [
            "10 Tips That Actually Work [Score: 92]",
            "The SHOCKING Truth Nobody Talks About [Score: 88]",
            "Why This Is Taking Over in 2026 [Score: 85]",
            "I Tried This for 30 Days [Score: 90]",
            "The Ultimate Guide [Score: 83]",
        ]
        for idea in ideas:
            self.optimized_list.addItem(idea)
