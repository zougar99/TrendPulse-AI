import sys, os, json, threading, subprocess, time
from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from desktop.theme import apply_theme
from desktop.pages.dashboard import DashboardPage
from desktop.pages.viral_dna import ViralDNALabPage
from desktop.pages.viral_map import ViralScoreMapPage
from desktop.pages.niche_finder import NicheFinderPage
from desktop.pages.trend_timeline import TrendTimelinePage
from desktop.pages.smart_alerts import SmartAlertEnginePage
from desktop.pages.thumbnail_lab import ThumbnailLabPage
from desktop.pages.title_psychology import TitlePsychologyPage
from desktop.pages.ai_chat import AIChatPage
from desktop.pages.early_detection import EarlyDetectionPage
from desktop.pages.voice_command import VoiceCommandPage
from desktop.pages.content_generator import ContentGeneratorPage
from desktop.pages.content_calendar import ContentCalendarPage
from desktop.pages.cloud import TrendPulseCloudPage
from desktop.pages.community import CommunityIntelPage
from desktop.pages.screenshot import ScreenshotAnalyzerPage
from desktop.pages.real_time_trends import RealTimeTrendEnginePage
from desktop.pages.faceless_content import FacelessContentPage
from desktop.pages.competitor_intel import CompetitorIntelligencePage
from desktop.pages.shorts_analyzer import ShortsAnalyzerPage
from desktop.pages.settings import SettingsPage

NAV_ITEMS = [
    ("dashboard", "◎", "Dashboard"),
    ("viral_dna", "🧬", "Viral DNA Lab"),
    ("viral_map", "🌍", "Viral Score Map"),
    ("niche", "🎯", "Niche Finder"),
    ("timeline", "📈", "Trend Timeline"),
    ("alerts", "🔔", "Smart Alerts"),
    ("thumbnail", "🖼", "Thumbnail Lab"),
    ("titles", "📝", "Title Psychology"),
    ("chat", "💬", "AI Chat"),
    ("early", "📡", "Early Detection"),
    ("voice", "🎤", "Voice Command"),
    ("content", "✍", "Content Generator"),
    ("calendar", "📅", "Content Calendar"),
    ("cloud", "☁", "TrendPulse Cloud"),
    ("community", "👥", "Community Intel"),
    ("screenshot", "📸", "Screenshot Analyzer"),
    ("realtime", "⚡", "Real-Time Trends"),
    ("faceless", "🎭", "Faceless Content"),
    ("competitor", "🏆", "Competitor Intel"),
    ("shorts", "📱", "Shorts Analyzer"),
    ("settings", "⚙", "Settings"),
]

PAGE_MAP = {
    "dashboard": DashboardPage,
    "viral_dna": ViralDNALabPage,
    "viral_map": ViralScoreMapPage,
    "niche": NicheFinderPage,
    "timeline": TrendTimelinePage,
    "alerts": SmartAlertEnginePage,
    "thumbnail": ThumbnailLabPage,
    "titles": TitlePsychologyPage,
    "chat": AIChatPage,
    "early": EarlyDetectionPage,
    "voice": VoiceCommandPage,
    "content": ContentGeneratorPage,
    "calendar": ContentCalendarPage,
    "cloud": TrendPulseCloudPage,
    "community": CommunityIntelPage,
    "screenshot": ScreenshotAnalyzerPage,
    "realtime": RealTimeTrendEnginePage,
    "faceless": FacelessContentPage,
    "competitor": CompetitorIntelligencePage,
    "shorts": ShortsAnalyzerPage,
    "settings": SettingsPage,
}

class SidebarButton(QPushButton):
    def __init__(self, icon_char, text, parent=None):
        super().__init__(parent)
        self.setText(f"  {icon_char}  {text}")
        self.setCheckable(True)
        self.setCursor(Qt.CursorShape.PointingHandCursor)
        self.setMinimumHeight(36)

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("TrendPulse AI — Intelligence Engine")
        self.setMinimumSize(1200, 750)
        self.setWindowIcon(self._make_icon())

        central = QWidget()
        self.setCentralWidget(central)
        layout = QHBoxLayout(central)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        # Sidebar
        self.sidebar = QWidget()
        self.sidebar.setObjectName("sidebar")
        sidebar_layout = QVBoxLayout(self.sidebar)
        sidebar_layout.setContentsMargins(0, 0, 0, 0)
        sidebar_layout.setSpacing(0)

        logo = QLabel("◈ TrendPulse AI")
        logo.setObjectName("logoLabel")
        logo.setAlignment(Qt.AlignmentFlag.AlignCenter)
        sidebar_layout.addWidget(logo)

        self.btn_group = QButtonGroup()
        self.btn_group.setExclusive(True)
        self.nav_buttons = []

        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setHorizontalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)
        scroll.setVerticalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAsNeeded)
        scroll.setFrameShape(QFrame.Shape.NoFrame)
        nav_container = QWidget()
        nav_layout = QVBoxLayout(nav_container)
        nav_layout.setContentsMargins(6, 6, 6, 6)
        nav_layout.setSpacing(1)

        for i, (key, icon, label) in enumerate(NAV_ITEMS):
            btn = SidebarButton(icon, label)
            btn.setProperty("nav_key", key)
            self.btn_group.addButton(btn, i)
            nav_layout.addWidget(btn)
            self.nav_buttons.append(btn)

        nav_layout.addStretch()
        scroll.setWidget(nav_container)
        sidebar_layout.addWidget(scroll)

        # Version label at bottom of sidebar
        ver = QLabel("v3.0.0")
        ver.setObjectName("mutedText")
        ver.setAlignment(Qt.AlignmentFlag.AlignCenter)
        ver.setMargin(8)
        sidebar_layout.addWidget(ver)

        # Content area
        content_widget = QWidget()
        content_widget.setObjectName("contentArea")
        self.content_layout = QVBoxLayout(content_widget)
        self.content_layout.setContentsMargins(0, 0, 0, 0)

        self.stack = QStackedWidget()
        self.content_layout.addWidget(self.stack)

        # Status bar
        self.status_bar = QStatusBar()
        self.status_bar.setStyleSheet("""
            QStatusBar { background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.03); padding: 2px 10px; }
            QStatusBar QLabel { color: rgba(255,255,255,0.3); font-size: 10px; }
        """)
        self.status_label = QLabel("● Connecting to server...")
        self.status_label.setStyleSheet("color: #FFD700; font-size: 10px;")
        self.server_status = QLabel("●")
        self.server_status.setStyleSheet("color: #FFD700; font-size: 10px;")
        self.status_bar.addWidget(self.server_status)
        self.status_bar.addWidget(self.status_label)
        self.setStatusBar(self.status_bar)

        layout.addWidget(self.sidebar, 1)
        layout.addWidget(content_widget, 5)

        # Create all pages
        self.pages = {}
        for key, PageClass in PAGE_MAP.items():
            page = PageClass()
            self.stack.addWidget(page)
            self.pages[key] = page

        # Connect navigation
        self.btn_group.idClicked.connect(self._navigate)

        # Select dashboard
        self.nav_buttons[0].setChecked(True)
        self._navigate(0)

        # Server check timer
        self.server_timer = QTimer()
        self.server_timer.timeout.connect(self._check_server)
        self.server_timer.start(5000)
        self._check_server()

    def _navigate(self, idx):
        key = NAV_ITEMS[idx][0]
        page = self.pages.get(key)
        if page:
            self.stack.setCurrentWidget(page)
            self.setWindowTitle(f"TrendPulse AI — {page.page_title}")

    def _check_server(self):
        try:
            import urllib.request
            req = urllib.request.Request("http://localhost:3000/api/viral/check",
                                         data=b'{"keyword":"ping"}',
                                         headers={'Content-Type': 'application/json'},
                                         method='POST')
            with urllib.request.urlopen(req, timeout=3) as resp:
                if resp.status == 200:
                    self.server_status.setStyleSheet("color: #00FF88; font-size: 10px;")
                    self.status_label.setText("● Server connected")
                    self.status_label.setStyleSheet("color: #00FF88; font-size: 10px;")
                else:
                    raise Exception()
        except:
            self.server_status.setStyleSheet("color: #FF2D95; font-size: 10px;")
            self.status_label.setText("● Server disconnected")
            self.status_label.setStyleSheet("color: #FF2D95; font-size: 10px;")

    def _make_icon(self):
        pixmap = QPixmap(64, 64)
        pixmap.fill(Qt.GlobalColor.transparent)
        painter = QPainter(pixmap)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        gradient = QLinearGradient(0, 0, 64, 64)
        gradient.setColorAt(0, QColor("#00BFFF"))
        gradient.setColorAt(1, QColor("#8A5CFF"))
        painter.setBrush(QBrush(gradient))
        painter.setPen(Qt.PenStyle.NoPen)
        painter.drawRoundedRect(4, 4, 56, 56, 12, 12)
        painter.setPen(QColor("#FFFFFF"))
        font = QFont("Segoe UI", 20, QFont.Weight.Bold)
        painter.setFont(font)
        painter.drawText(QRect(4, 4, 56, 56), Qt.AlignmentFlag.AlignCenter, "TP")
        painter.end()
        return QIcon(pixmap)

class StartServerThread(QThread):
    started = pyqtSignal()
    error = pyqtSignal(str)

    def run(self):
        try:
            app_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            server_script = os.path.join(app_dir, "app.py")
            if os.path.exists(server_script):
                self.process = subprocess.Popen(
                    [sys.executable, server_script],
                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                    cwd=app_dir
                )
                time.sleep(2)
                self.started.emit()
            else:
                self.error.emit(f"Server not found: {server_script}")
        except Exception as e:
            self.error.emit(str(e))

def launch_desktop():
    app = QApplication(sys.argv)
    app.setApplicationName("TrendPulse AI")
    apply_theme(app)

    # Try to start server
    server_thread = StartServerThread()
    server_thread.start()

    window = MainWindow()
    window.show()
    sys.exit(app.exec())
