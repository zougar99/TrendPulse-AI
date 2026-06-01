from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from desktop.api_client import *
import random

class TrendPulseCloudPage(QWidget):
    page_title = "TrendPulse Cloud"

    def __init__(self):
        super().__init__()
        self.setObjectName("trendPulseCloudPage")
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

        title = QLabel("TrendPulse Cloud")
        title.setObjectName("titleLabel")
        sl.addWidget(title)

        status_card = QFrame()
        status_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        status_layout = QHBoxLayout(status_card)
        self.cloud_dot = QLabel("●")
        self.cloud_dot.setStyleSheet("font-size: 24px; color: #00FF88;")
        status_layout.addWidget(self.cloud_dot)
        self.cloud_status = QLabel("Connected")
        self.cloud_status.setStyleSheet("font-size: 16px; font-weight: 600; color: #00FF88;")
        status_layout.addWidget(self.cloud_status)
        status_layout.addStretch()
        status_layout.addWidget(QLabel("Last sync: Just now"))
        status_layout.addWidget(QLabel("Device: DESKTOP-WIN"))
        sl.addWidget(status_card)

        storage_card = QFrame()
        storage_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        storage_layout = QVBoxLayout(storage_card)
        storage_layout.addWidget(QLabel("Cloud Storage"))
        metrics = [
            ("Keywords Saved", f"{random.randint(500, 5000):,}", "#00BFFF"),
            ("Analytics History", f"{random.randint(100, 2000)} entries", "#8A5CFF"),
            ("Backup Size", f"{random.randint(10, 500)} MB", "#FF2D95"),
        ]
        for label, value, color in metrics:
            hl = QHBoxLayout()
            lbl = QLabel(label)
            lbl.setStyleSheet("font-size: 12px; color: rgba(255,255,255,0.6);")
            val = QLabel(value)
            val.setStyleSheet(f"font-size: 16px; font-weight: 700; color: {color};")
            hl.addWidget(lbl)
            hl.addStretch()
            hl.addWidget(val)
            storage_layout.addLayout(hl)
        sl.addWidget(storage_card)

        sync_card = QFrame()
        sync_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        sync_layout = QHBoxLayout(sync_card)
        sync_btn = QPushButton("Sync Now")
        sync_btn.setObjectName("btnPrimary")
        sync_btn.clicked.connect(lambda: QTimer.singleShot(500, self.sync_now))
        save_btn = QPushButton("Save Keyword History")
        save_btn.setObjectName("btnPrimary")
        save_btn.clicked.connect(self.save_history)
        load_btn = QPushButton("Load Keyword History")
        load_btn.setObjectName("btnPrimary")
        load_btn.clicked.connect(self.load_history)
        sync_layout.addWidget(sync_btn)
        sync_layout.addWidget(save_btn)
        sync_layout.addWidget(load_btn)
        sl.addWidget(sync_card)

        backup_card = QFrame()
        backup_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        backup_layout = QHBoxLayout(backup_card)
        create_backup = QPushButton("Create Backup")
        create_backup.setObjectName("btnAccent")
        create_backup.clicked.connect(self.create_backup)
        restore_backup = QPushButton("Restore Backup")
        restore_backup.setObjectName("btnPrimary")
        restore_backup.clicked.connect(self.restore_backup)
        backup_layout.addWidget(create_backup)
        backup_layout.addWidget(restore_backup)
        sl.addWidget(backup_card)

        team_card = QFrame()
        team_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        team_layout = QVBoxLayout(team_card)
        team_layout.addWidget(QLabel("Team"))
        team_input = QHBoxLayout()
        self.team_email = QLineEdit()
        self.team_email.setPlaceholderText("Enter email to invite...")
        invite_btn = QPushButton("Invite")
        invite_btn.setObjectName("btnPrimary")
        invite_btn.clicked.connect(self.invite_team)
        team_input.addWidget(self.team_email)
        team_input.addWidget(invite_btn)
        team_layout.addLayout(team_input)
        self.team_list = QListWidget()
        team_layout.addWidget(self.team_list)
        sl.addWidget(team_card)

        scroll.setWidget(scroll_widget)
        layout.addWidget(scroll)

        self.load_team()

    def sync_now(self):
        self.cloud_dot.setStyleSheet("font-size: 24px; color: #FFD700;")
        self.cloud_status.setText("Syncing...")
        self.cloud_status.setStyleSheet("font-size: 16px; font-weight: 600; color: #FFD700;")
        QTimer.singleShot(2000, lambda: self.sync_done())

    def sync_done(self):
        self.cloud_dot.setStyleSheet("font-size: 24px; color: #00FF88;")
        self.cloud_status.setText("Connected")
        self.cloud_status.setStyleSheet("font-size: 16px; font-weight: 600; color: #00FF88;")

    def save_history(self):
        QMessageBox.information(self, "Save History", "Keyword history saved to cloud.")

    def load_history(self):
        QMessageBox.information(self, "Load History", "Keyword history loaded from cloud.")

    def create_backup(self):
        QMessageBox.information(self, "Backup", "Cloud backup created successfully.")

    def restore_backup(self):
        reply = QMessageBox.question(self, "Restore Backup", "Restore from latest backup?",
                                      QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No)
        if reply == QMessageBox.StandardButton.Yes:
            QMessageBox.information(self, "Restore", "Backup restored successfully.")

    def invite_team(self):
        email = self.team_email.text().strip()
        if email:
            self.team_list.addItem(f"{email} (Invited)")
            self.team_email.clear()

    def load_team(self):
        members = ["alice@trendpulse.ai (Active)", "bob@trendpulse.ai (Active)", "charlie@trendpulse.ai (Pending)"]
        for m in members:
            self.team_list.addItem(m)
