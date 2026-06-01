from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from desktop.api_client import *
import random

class ContentCalendarPage(QWidget):
    page_title = "Content Calendar"

    def __init__(self):
        super().__init__()
        self.setObjectName("contentCalendarPage")
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

        title = QLabel("Content Calendar")
        title.setObjectName("titleLabel")
        sl.addWidget(title)

        self.month_selector = QComboBox()
        self.month_selector.addItems(["January 2026", "February 2026", "March 2026", "April 2026", "May 2026", "June 2026"])
        sl.addWidget(self.month_selector)

        self.calendar_widget = CalendarWidget()
        self.calendar_widget.setMinimumHeight(250)
        sl.addWidget(self.calendar_widget)

        times_card = QFrame()
        times_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        times_layout = QVBoxLayout(times_card)
        times_layout.addWidget(QLabel("Best Upload Times"))
        platforms = [("YouTube", "#FF0000"), ("TikTok", "#000000"), ("Instagram", "#E4405F")]
        for name, color in platforms:
            hl = QHBoxLayout()
            lbl = QLabel(name)
            lbl.setFixedWidth(80)
            lbl.setStyleSheet("font-size: 11px; color: rgba(255,255,255,0.6);")
            bar = QProgressBar()
            bar.setMaximum(100)
            bar.setValue(random.randint(50, 95))
            bar.setTextVisible(True)
            bar.setStyleSheet(f"""
                QProgressBar {{ background: rgba(255,255,255,0.04); border: none; border-radius: 4px; height: 14px; text-align: center; font-size: 9px; color: white; }}
                QProgressBar::chunk {{ background: {color}; border-radius: 4px; }}
            """)
            hl.addWidget(lbl)
            hl.addWidget(bar)
            times_layout.addLayout(hl)
        sl.addWidget(times_card)

        viral_card = QFrame()
        viral_card.setStyleSheet("QFrame { background: rgba(18,18,26,0.85); border: 1px solid rgba(255,255,255,0.04); border-radius: 10px; padding: 16px; }")
        viral_layout = QVBoxLayout(viral_card)
        viral_layout.addWidget(QLabel("Viral Opportunities"))
        self.viral_list = QListWidget()
        for _ in range(5):
            day = random.randint(1, 28)
            vp = random.randint(70, 98)
            self.viral_list.addItem(f"March {day}: Viral opportunity - {vp}% probability")
        viral_layout.addWidget(self.viral_list)
        sl.addWidget(viral_card)

        self.forecast_widget = ContentForecastWidget()
        self.forecast_widget.setMinimumHeight(150)
        sl.addWidget(self.forecast_widget)

        scroll.setWidget(scroll_widget)
        layout.addWidget(scroll)


class CalendarWidget(QWidget):
    def __init__(self):
        super().__init__()
        self.publish_dates = set(random.sample(range(1, 29), random.randint(5, 10)))

    def paintEvent(self, event):
        p = QPainter(self)
        p.setRenderHint(QPainter.RenderHint.Antialiasing)
        w = self.width() - 20
        h = self.height() - 20
        p.setPen(QPen(QColor(60, 60, 70), 1))
        days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
        day_h = 20
        p.setPen(QColor(100, 100, 120))
        font = QFont("Segoe UI", 8)
        p.setFont(font)
        for i, d in enumerate(days):
            p.drawText(QRectF(20 + i * (w / 7), 5, w / 7, day_h), Qt.AlignmentFlag.AlignCenter, d)
        cell_w = w / 7
        cell_h = (h - day_h - 10) / 5
        start_day = 3
        for day in range(1, 32):
            col = (start_day + day - 1) % 7
            row = (start_day + day - 1) // 7
            x = 20 + col * cell_w
            y = 10 + day_h + row * cell_h
            if day in self.publish_dates:
                p.setBrush(QColor(0, 191, 255, 80))
                p.setPen(QPen(QColor(0, 191, 255), 1))
                p.drawRoundedRect(QRectF(x + 2, y + 2, cell_w - 4, cell_h - 4), 4, 4)
                p.fillRect(QRectF(x + 2, y + 2, cell_w - 4, cell_h - 4), QColor(0, 191, 255, 100))
            else:
                p.setPen(QPen(QColor(60, 60, 70), 1))
            p.setPen(QColor(200, 200, 200))
            p.drawText(QRectF(x, y, cell_w, cell_h), Qt.AlignmentFlag.AlignCenter, str(day))


class ContentForecastWidget(QWidget):
    def paintEvent(self, event):
        p = QPainter(self)
        p.setRenderHint(QPainter.RenderHint.Antialiasing)
        w = self.width() - 40
        h = self.height() - 40
        points = []
        for i in range(12):
            x = 20 + (w / 12) * i
            y = 20 + h - (random.randint(20, 90) / 100.0) * h
            points.append(QPointF(x, y))
        p.setPen(QPen(QColor(0, 191, 255), 2))
        for i in range(len(points) - 1):
            p.drawLine(points[i], points[i + 1])
        p.setBrush(QColor(0, 191, 255, 30))
        path = QPainterPath()
        path.moveTo(points[0])
        for i in range(1, len(points)):
            path.lineTo(points[i])
        path.lineTo(points[-1].x(), 20 + h)
        path.lineTo(points[0].x(), 20 + h)
        path.closeSubpath()
        p.fillPath(path, QColor(0, 191, 255, 30))
        p.setPen(QColor(100, 100, 120))
        font = QFont("Segoe UI", 8)
        p.setFont(font)
        months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        for i, m in enumerate(months):
            x = 20 + (w / 12) * i
            p.drawText(QRectF(x - 15, 20 + h + 5, 30, 15), Qt.AlignmentFlag.AlignCenter, m)
