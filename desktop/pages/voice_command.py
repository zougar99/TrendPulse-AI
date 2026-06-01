from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from desktop.api_client import *
import random

class VoiceCommandPage(QWidget):
    page_title = "Voice Command"

    def __init__(self):
        super().__init__()
        self.setObjectName("voiceCommandPage")
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
        title = QLabel("Voice Command")
        title.setObjectName("titleLabel")
        header.addWidget(title)
        self.status_label = QLabel("●  Idle")
        self.status_label.setStyleSheet("color: rgba(255,255,255,0.4); font-size: 12px;")
        header.addStretch()
        header.addWidget(self.status_label)
        sl.addLayout(header)

        mic_btn = QPushButton()
        mic_btn.setFixedSize(100, 100)
        mic_btn.setObjectName("micButton")
        mic_btn.setStyleSheet("""
            QPushButton#micButton {
                background: rgba(0,191,255,0.08);
                border: 2px solid #00BFFF;
                border-radius: 50px;
                font-size: 30px;
                color: #00BFFF;
            }
            QPushButton#micButton:hover {
                background: rgba(0,191,255,0.15);
            }
            QPushButton#micButton:checked {
                background: rgba(255,45,149,0.15);
                border: 2px solid #FF2D95;
                color: #FF2D95;
            }
        """)
        mic_btn.setText("🎤")
        mic_btn.setCheckable(True)
        mic_btn.toggled.connect(self.on_mic_toggle)
        mic_btn.setCursor(QCursor(Qt.CursorShape.PointingHandCursor))
        mic_layout = QHBoxLayout()
        mic_layout.addStretch()
        mic_layout.addWidget(mic_btn)
        mic_layout.addStretch()
        sl.addLayout(mic_layout)

        self.transcription_card = QFrame()
        self.transcription_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        trans_layout = QVBoxLayout(self.transcription_card)
        trans_layout.addWidget(QLabel("Transcription"))
        self.transcription_label = QLabel("Click the mic to start voice command...")
        self.transcription_label.setWordWrap(True)
        self.transcription_label.setStyleSheet("color: rgba(255,255,255,0.6); font-size: 13px; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px;")
        trans_layout.addWidget(self.transcription_label)
        sl.addWidget(self.transcription_card)

        commands_card = QFrame()
        commands_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        cmd_layout = QVBoxLayout(commands_card)
        cmd_layout.addWidget(QLabel("Available Commands"))
        commands = [
            "analyze [keyword]",
            "find niches for [topic]",
            "check viral score for [keyword]",
            "generate content about [topic]",
            "show dashboard",
            "scan for trends",
            "compare [keyword A] and [keyword B]",
            "open settings",
        ]
        for cmd in commands:
            lbl = QLabel(f"▸ {cmd}")
            lbl.setStyleSheet("color: rgba(255,255,255,0.5); font-size: 11px; padding: 2px 0;")
            cmd_layout.addWidget(lbl)
        sl.addWidget(commands_card)

        response_card = QFrame()
        response_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        resp_layout = QVBoxLayout(response_card)
        resp_layout.addWidget(QLabel("AI Response"))
        self.response_label = QLabel("Awaiting command...")
        self.response_label.setWordWrap(True)
        self.response_label.setStyleSheet("color: #00FFF0; font-size: 13px; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px;")
        resp_layout.addWidget(self.response_label)
        sl.addWidget(response_card)

        scroll.setWidget(scroll_widget)
        layout.addWidget(scroll)

    def on_mic_toggle(self, checked):
        if checked:
            self.status_label.setText("●  Listening")
            self.status_label.setStyleSheet("color: #FF2D95; font-size: 12px;")
            self.transcription_label.setText("Listening... speak now.")
            QTimer.singleShot(2000, lambda: self.simulate_command())
        else:
            self.status_label.setText("●  Idle")
            self.status_label.setStyleSheet("color: rgba(255,255,255,0.4); font-size: 12px;")

    def simulate_command(self):
        self.status_label.setText("●  Processing")
        self.status_label.setStyleSheet("color: #FFD700; font-size: 12px;")
        commands = [
            ("analyze AI trends", "Analyzing AI trends... Top keywords: machine learning, deep learning, neural networks, GPT-5. Momentum score: 89."),
            ("find niches for python", "High opportunity niches for python: Python automation (92%), Python data science (88%), Python web development (85%)."),
            ("check viral score for crypto", "Viral score: 76/100. Emotional triggers: Curiosity 82%, Urgency 74%, Fear 68%. Hook strength: Strong."),
            ("show dashboard", "Dashboard loaded. Keywords tracked: 2,847. Pages analyzed: 953. Viral detected: 142."),
            ("scan for trends", "Scanning complete. 3 emerging trends detected: AI coding assistants (+340%), Quantum computing (+180%), Edge AI (+120%)."),
        ]
        cmd, response = random.choice(commands)
        self.transcription_label.setText(f'"{cmd}"')
        QTimer.singleShot(1000, lambda: self.show_response(response))

    def show_response(self, response):
        self.response_label.setText(response)
        self.status_label.setText("●  Idle")
        self.status_label.setStyleSheet("color: rgba(255,255,255,0.4); font-size: 12px;")
