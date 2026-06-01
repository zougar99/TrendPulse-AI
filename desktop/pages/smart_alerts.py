from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from desktop.api_client import *
import random

class SmartAlertEnginePage(QWidget):
    page_title = "Smart Alert Engine"

    def __init__(self):
        super().__init__()
        self.setObjectName("smartAlertEnginePage")
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

        title = QLabel("Smart Alert Engine")
        title.setObjectName("titleLabel")
        sl.addWidget(title)

        self.alerts_list = QListWidget()
        self.alerts_list.setObjectName("alertsList")
        sl.addWidget(self.alerts_list)

        self.load_alerts()

        config_card = QFrame()
        config_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        config_layout = QVBoxLayout(config_card)
        config_title = QLabel("Alert Configuration")
        config_title.setObjectName("cardTitle")
        config_layout.addWidget(config_title)
        toggles = [("Desktop Notifications", True), ("Email Alerts", False), ("Telegram Alerts", True), ("Discord Alerts", False)]
        self.toggle_switches = {}
        for name, default in toggles:
            hl = QHBoxLayout()
            lbl = QLabel(name)
            lbl.setStyleSheet("font-size: 12px; color: rgba(255,255,255,0.7);")
            cb = QCheckBox()
            cb.setChecked(default)
            cb.setStyleSheet("QCheckBox::indicator { width: 16px; height: 16px; } QCheckBox::indicator:checked { background-color: #00BFFF; border-radius: 3px; } QCheckBox::indicator:unchecked { background-color: rgba(255,255,255,0.1); border-radius: 3px; }")
            self.toggle_switches[name] = cb
            hl.addWidget(lbl)
            hl.addStretch()
            hl.addWidget(cb)
            config_layout.addLayout(hl)
        sl.addWidget(config_card)

        scroll.setWidget(scroll_widget)
        layout.addWidget(scroll)

    def load_alerts(self):
        alerts = [
            ("Trend detected early", "AI tools keyword cluster emerging", "Urgent", "#FF2D95"),
            ("Keyword growth acceleration", "python machine learning +45% velocity", "High", "#FFD700"),
            ("Viral topic identified", "ChatGPT tutorial content spiking", "Medium", "#00BFFF"),
            ("Competitor spike", "Channel 'TechWithTim' uploaded viral short", "High", "#FFD700"),
            ("Ranking opportunity", "Low competition keyword: data science basics", "Medium", "#00BFFF"),
            ("Seasonal trend alert", "Summer coding camp keywords rising", "Low", "#8A5CFF"),
            ("Engagement anomaly", "+300% comments on AI tutorial videos", "Urgent", "#FF2D95"),
        ]
        for title_desc, desc, priority, color in alerts:
            item_widget = QWidget()
            item_layout = QHBoxLayout(item_widget)
            item_layout.setContentsMargins(8, 4, 8, 4)
            badge = QLabel(priority)
            badge.setStyleSheet(f"background: {color}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 600;")
            badge.setFixedHeight(20)
            text_layout = QVBoxLayout()
            t = QLabel(title_desc)
            t.setStyleSheet("font-size: 12px; font-weight: 600; color: white;")
            d = QLabel(desc)
            d.setStyleSheet("font-size: 10px; color: rgba(255,255,255,0.5);")
            text_layout.addWidget(t)
            text_layout.addWidget(d)
            dismiss_btn = QPushButton("Dismiss")
            dismiss_btn.setFixedSize(70, 24)
            dismiss_btn.setStyleSheet("background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); border: none; border-radius: 4px; font-size: 10px;")
            dismiss_btn.clicked.connect(lambda checked, w=item_widget: self.dismiss_alert(w))
            item_layout.addWidget(badge)
            item_layout.addLayout(text_layout)
            item_layout.addStretch()
            item_layout.addWidget(dismiss_btn)
            list_item = QListWidgetItem()
            list_item.setSizeHint(item_widget.sizeHint())
            self.alerts_list.addItem(list_item)
            self.alerts_list.setItemWidget(list_item, item_widget)

    def dismiss_alert(self, widget):
        for i in range(self.alerts_list.count()):
            if self.alerts_list.itemWidget(self.alerts_list.item(i)) == widget:
                self.alerts_list.takeItem(i)
                break
