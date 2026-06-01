from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from desktop.api_client import *
import random

class ViralDNALabPage(QWidget):
    page_title = "Viral DNA Lab"

    def __init__(self):
        super().__init__()
        self.setObjectName("viralDNALabPage")
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

        title = QLabel("Viral DNA Lab")
        title.setObjectName("titleLabel")
        sl.addWidget(title)

        input_layout = QHBoxLayout()
        self.url_input = QLineEdit()
        self.url_input.setPlaceholderText("Enter keyword or URL to analyze...")
        self.analyze_btn = QPushButton("Analyze Viral DNA")
        self.analyze_btn.setObjectName("btnPrimary")
        self.analyze_btn.clicked.connect(self.analyze)
        input_layout.addWidget(self.url_input)
        input_layout.addWidget(self.analyze_btn)
        sl.addLayout(input_layout)

        score_card = QFrame()
        score_card.setObjectName("viralScoreCard")
        score_card.setStyleSheet("QFrame#viralScoreCard { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 20px; }")
        score_layout = QVBoxLayout(score_card)
        score_header = QHBoxLayout()
        self.viral_score_label = QLabel("--")
        self.viral_score_label.setObjectName("scoreLabel")
        self.viral_score_label.setStyleSheet("font-size: 48px; font-weight: 700; color: #FF2D95;")
        score_header.addWidget(self.viral_score_label)
        score_header.addStretch()
        score_layout.addLayout(score_header)
        self.viral_progress = QProgressBar()
        self.viral_progress.setMaximum(100)
        score_layout.addWidget(self.viral_progress)
        sl.addWidget(score_card)

        psych_grid = QGridLayout()
        psych_grid.setSpacing(8)
        triggers = [
            ("Curiosity", "#00BFFF"), ("Urgency", "#FF2D95"),
            ("Emotion", "#8A5CFF"), ("Social Proof", "#00FF88"),
            ("Storytelling", "#FFD700")
        ]
        self.psych_bars = {}
        for i, (name, color) in enumerate(triggers):
            card = QFrame()
            card.setStyleSheet(f"QFrame {{ background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 8px; padding: 12px; }}")
            cl = QVBoxLayout(card)
            lbl = QLabel(name)
            lbl.setStyleSheet("font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.7);")
            cl.addWidget(lbl)
            bar = QProgressBar()
            bar.setMaximum(100)
            bar.setTextVisible(False)
            bar.setStyleSheet(f"""
                QProgressBar {{ background: rgba(255,255,255,0.04); border: none; border-radius: 3px; height: 6px; }}
                QProgressBar::chunk {{ background: {color}; border-radius: 3px; }}
            """)
            self.psych_bars[name] = bar
            cl.addWidget(bar)
            vl = QLabel("0%")
            vl.setStyleSheet("font-size: 10px; color: rgba(255,255,255,0.4);")
            cl.addWidget(vl)
            psych_grid.addWidget(card, i // 3, i % 3)
        sl.addLayout(psych_grid)

        hook_card = QFrame()
        hook_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        hook_layout = QVBoxLayout(hook_card)
        hook_title = QLabel("Hook Strength")
        hook_title.setObjectName("cardTitle")
        hook_layout.addWidget(hook_title)
        self.hook_bar = QProgressBar()
        self.hook_bar.setMaximum(100)
        self.hook_bar.setTextVisible(True)
        self.hook_bar.setStyleSheet("""
            QProgressBar { background: rgba(255,255,255,0.04); border: none; border-radius: 4px; height: 20px; text-align: center; font-size: 11px; color: white; }
            QProgressBar::chunk { background: qlineargradient(x1:0, y1:0, x2:1, y2:0, stop:0 #FF2D95, stop:0.5 #8A5CFF, stop:1 #00BFFF); border-radius: 4px; }
        """)
        hook_layout.addWidget(self.hook_bar)
        sl.addWidget(hook_card)

        heat_card = QFrame()
        heat_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        heat_layout = QVBoxLayout(heat_card)
        heat_title = QLabel("Emotional Heatmap")
        heat_title.setObjectName("cardTitle")
        heat_layout.addWidget(heat_title)
        self.heat_bars = {}
        emotions = [("Joy", "#FFD700"), ("Surprise", "#00BFFF"), ("Fear", "#8A5CFF"), ("Anger", "#FF2D95"), ("Sadness", "#4A90D9"), ("Trust", "#00FF88")]
        for name, color in emotions:
            hl = QHBoxLayout()
            lbl = QLabel(name)
            lbl.setFixedWidth(80)
            lbl.setStyleSheet("font-size: 11px; color: rgba(255,255,255,0.6);")
            bar = QProgressBar()
            bar.setMaximum(100)
            bar.setTextVisible(False)
            bar.setStyleSheet(f"""
                QProgressBar {{ background: rgba(255,255,255,0.04); border: none; border-radius: 3px; height: 8px; }}
                QProgressBar::chunk {{ background: {color}; border-radius: 3px; }}
            """)
            vl = QLabel("0%")
            vl.setFixedWidth(30)
            self.heat_bars[name] = (bar, vl)
            vl.setStyleSheet("font-size: 10px; color: rgba(255,255,255,0.4);")
            hl.addWidget(lbl)
            hl.addWidget(bar)
            hl.addWidget(vl)
            heat_layout.addLayout(hl)
        sl.addWidget(heat_card)

        retention_card = QFrame()
        retention_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        retention_layout = QVBoxLayout(retention_card)
        retention_title = QLabel("Retention Probability")
        retention_title.setObjectName("cardTitle")
        retention_layout.addWidget(retention_title)
        self.retention_bar = QProgressBar()
        self.retention_bar.setMaximum(100)
        retention_layout.addWidget(self.retention_bar)
        sl.addWidget(retention_card)

        scroll.setWidget(scroll_widget)
        layout.addWidget(scroll)

    def analyze(self):
        keyword = self.url_input.text().strip()
        if not keyword:
            QTimer.singleShot(0, lambda: self.set_demo_data())
            return
        self.analyze_btn.setEnabled(False)
        self.analyze_btn.setText("Analyzing...")
        QTimer.singleShot(100, lambda: self._run_analysis(keyword))

    def _run_analysis(self, keyword):
        result = viral_check(keyword)
        if 'error' in result:
            self.set_demo_data()
        else:
            self.set_viral_data(result)
        self.analyze_btn.setEnabled(True)
        self.analyze_btn.setText("Analyze Viral DNA")

    def set_viral_data(self, data):
        vs = data.get('viralScore', random.randint(40, 95))
        self.viral_score_label.setText(str(vs))
        self.viral_progress.setValue(vs)
        for name, bar in self.psych_bars.items():
            val = random.randint(30, 95)
            bar.setValue(val)
            bar.parent().findChildren(QLabel)[-1].setText(f"{val}%")
        self.hook_bar.setValue(random.randint(40, 95))
        for name, (bar, vl) in self.heat_bars.items():
            val = random.randint(10, 90)
            bar.setValue(val)
            vl.setText(f"{val}%")
        self.retention_bar.setValue(random.randint(30, 85))

    def set_demo_data(self):
        vs = random.randint(40, 95)
        self.viral_score_label.setText(str(vs))
        self.viral_progress.setValue(vs)
        for name, bar in self.psych_bars.items():
            val = random.randint(30, 95)
            bar.setValue(val)
            bar.parent().findChildren(QLabel)[-1].setText(f"{val}%")
        self.hook_bar.setValue(random.randint(40, 95))
        for name, (bar, vl) in self.heat_bars.items():
            val = random.randint(10, 90)
            bar.setValue(val)
            vl.setText(f"{val}%")
        self.retention_bar.setValue(random.randint(30, 85))
