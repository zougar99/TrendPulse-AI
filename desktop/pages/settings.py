from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from desktop.api_client import *
import random

class SettingsPage(QWidget):
    page_title = "Settings"

    def __init__(self):
        super().__init__()
        self.setObjectName("settingsPage")
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

        title = QLabel("Settings")
        title.setObjectName("titleLabel")
        sl.addWidget(title)

        api_card = QFrame()
        api_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        api_layout = QVBoxLayout(api_card)
        api_layout.addWidget(QLabel("API Configuration"))
        api_layout.addWidget(QLabel("API URL:"))
        self.api_url_input = QLineEdit("http://localhost:3000")
        api_layout.addWidget(self.api_url_input)
        api_layout.addWidget(QLabel("YouTube API Key:"))
        self.youtube_key_input = QLineEdit()
        self.youtube_key_input.setEchoMode(QLineEdit.EchoMode.Password)
        api_layout.addWidget(self.youtube_key_input)
        youtube_save = QPushButton("Save YouTube Key")
        youtube_save.setObjectName("btnPrimary")
        youtube_save.clicked.connect(self.save_youtube)
        api_layout.addWidget(youtube_save)
        api_layout.addWidget(QLabel("Gemini API Key:"))
        self.gemini_key_input = QLineEdit()
        self.gemini_key_input.setEchoMode(QLineEdit.EchoMode.Password)
        api_layout.addWidget(self.gemini_key_input)
        gemini_save = QPushButton("Save Gemini Key")
        gemini_save.setObjectName("btnPrimary")
        gemini_save.clicked.connect(self.save_gemini)
        api_layout.addWidget(gemini_save)
        sl.addWidget(api_card)

        pref_card = QFrame()
        pref_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        pref_layout = QVBoxLayout(pref_card)
        pref_layout.addWidget(QLabel("Preferences"))
        theme_layout = QHBoxLayout()
        theme_layout.addWidget(QLabel("Theme:"))
        self.theme_combo = QComboBox()
        self.theme_combo.addItems(["Cyberpunk Dark", "Cyberpunk Light", "Midnight Blue", "Hologram"])
        theme_layout.addWidget(self.theme_combo)
        theme_layout.addStretch()
        pref_layout.addLayout(theme_layout)
        auto_layout = QHBoxLayout()
        auto_layout.addWidget(QLabel("Auto Analyze on Input:"))
        self.auto_toggle = QCheckBox()
        self.auto_toggle.setChecked(True)
        self.auto_toggle.setStyleSheet("QCheckBox::indicator { width: 16px; height: 16px; } QCheckBox::indicator:checked { background-color: #00BFFF; border-radius: 3px; } QCheckBox::indicator:unchecked { background-color: rgba(255,255,255,0.1); border-radius: 3px; }")
        auto_layout.addWidget(self.auto_toggle)
        auto_layout.addStretch()
        pref_layout.addLayout(auto_layout)
        sl.addWidget(pref_card)

        version_card = QFrame()
        version_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        version_layout = QVBoxLayout(version_card)
        version_layout.addWidget(QLabel("About"))
        version_info = [
            ("Version", "3.0.0"),
            ("Build", "2026.03.001"),
            ("Python Engine", "v2.1"),
            ("Framework", "PyQt6"),
        ]
        for label, value in version_info:
            hl = QHBoxLayout()
            hl.addWidget(QLabel(label))
            hl.addStretch()
            val = QLabel(value)
            val.setStyleSheet("color: #00BFFF; font-weight: 600;")
            hl.addWidget(val)
            version_layout.addLayout(hl)
        sl.addWidget(version_card)

        scroll.setWidget(scroll_widget)
        layout.addWidget(scroll)

        self.load_settings()

    def load_settings(self):
        result = settings_get()
        youtube = result.get('youtube', '')
        gemini = result.get('gemini', '')
        if youtube:
            self.youtube_key_input.setText(youtube)
        if gemini:
            self.gemini_key_input.setText(gemini)

    def save_youtube(self):
        key = self.youtube_key_input.text().strip()
        if key:
            QTimer.singleShot(0, lambda: self._save_youtube(key))

    def _save_youtube(self, key):
        result = settings_set_youtube(key)
        if 'error' not in result:
            self.show_saved("YouTube API key saved")

    def save_gemini(self):
        key = self.gemini_key_input.text().strip()
        if key:
            QTimer.singleShot(0, lambda: self._save_gemini(key))

    def _save_gemini(self, key):
        result = settings_set_gemini(key)
        if 'error' not in result:
            self.show_saved("Gemini API key saved")

    def show_saved(self, msg):
        QTimer.singleShot(0, lambda: self._show_saved(msg))

    def _show_saved(self, msg):
        saved_label = QLabel(f"✓ {msg}")
        saved_label.setStyleSheet("color: #00FF88; font-size: 11px; padding: 4px;")
        saved_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.layout().addWidget(saved_label)
        QTimer.singleShot(2000, saved_label.deleteLater)
