from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, ListFlowable, ListItem, PageBreak
from reportlab.lib.utils import ImageReader

base = Path('/Volumes/T7/플젝/deundeunApp/Parrotkit')
out_pdf = base / 'output/pdf/20260307_parrotkit_deploy_e2e_retest_report.pdf'
shots = {
    'signup_fail': base / 'output/playwright/20260307_deploy_e2e_retest/03-after-signup.png',
    'shooting': base / 'output/playwright/20260307_deploy_capture_flow_retry/05-shooting-tab.png',
    'captured': base / 'output/playwright/20260307_deploy_capture_flow_retry/06-after-recording.png',
}

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='TitleCustom', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=21, leading=25, textColor=colors.HexColor('#111827'), alignment=TA_CENTER, spaceAfter=10))
styles.add(ParagraphStyle(name='Subtitle', parent=styles['BodyText'], fontName='Helvetica', fontSize=9.5, leading=12, textColor=colors.HexColor('#4b5563'), alignment=TA_CENTER, spaceAfter=12))
styles.add(ParagraphStyle(name='Section', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=13, leading=16, textColor=colors.HexColor('#111827'), spaceBefore=6, spaceAfter=5))
styles.add(ParagraphStyle(name='BodyCustom', parent=styles['BodyText'], fontName='Helvetica', fontSize=9.5, leading=13, textColor=colors.HexColor('#1f2937'), spaceAfter=4))
styles.add(ParagraphStyle(name='SmallMuted', parent=styles['BodyText'], fontName='Helvetica', fontSize=8.5, leading=11, textColor=colors.HexColor('#6b7280'), spaceAfter=4))

def fit_image(path: Path, max_width: float, max_height: float):
    img = ImageReader(str(path))
    iw, ih = img.getSize()
    scale = min(max_width / iw, max_height / ih)
    return Image(str(path), width=iw * scale, height=ih * scale)

story = []
story.append(Spacer(1, 5 * mm))
story.append(Paragraph('Parrotkit Deployment E2E Retest Report', styles['TitleCustom']))
story.append(Paragraph('Target URL: https://parrotkit-deploy.vercel.app/ | Test window: 2026-03-07 21:15-21:20 KST', styles['Subtitle']))

story.append(Paragraph('Executive Summary', styles['Section']))
summary_items = [
    'Fresh-account signup still fails on the deployed environment with HTTP 500.',
    'Existing-account login works.',
    'Reference submit, recipe generation, camera recording, and capture upload all passed in the deployed environment.',
    'Camera recording is the primary capture path and upload validation is part of that same flow.',
]
story.append(ListFlowable([ListItem(Paragraph(item, styles['BodyCustom'])) for item in summary_items], bulletType='bullet', start='circle', leftIndent=14))

story.append(Paragraph('Failure Path', styles['Section']))
story.append(Paragraph('Deployed signup remained on /signup and showed Internal server error after POST /api/auth/signup returned 500.', styles['BodyCustom']))
story.append(fit_image(shots['signup_fail'], 150 * mm, 70 * mm))

story.append(Paragraph('Working Path', styles['Section']))
working_items = [
    'Login returned 200 for the shared smoke-test account.',
    'Reference analyze returned 200.',
    'Recipe save returned 201.',
    'Capture upload returned 200 for scene 1.',
]
story.append(ListFlowable([ListItem(Paragraph(item, styles['BodyCustom'])) for item in working_items], bulletType='bullet', start='circle', leftIndent=14))

story.append(PageBreak())

story.append(Paragraph('Camera Recording Flow', styles['Section']))
story.append(Paragraph('The deployed shooting tab opened with a camera preview, accepted a short recording, and uploaded the capture successfully.', styles['BodyCustom']))
story.append(fit_image(shots['shooting'], 120 * mm, 75 * mm))
story.append(Spacer(1, 4 * mm))
story.append(fit_image(shots['captured'], 150 * mm, 95 * mm))

story.append(Paragraph('Interpretation', styles['Section']))
story.append(Paragraph('The deployment is partially healthy. The blocking issue is still concentrated in signup, while the logged-in creator workflow is operational through recipe generation, camera recording, and capture upload.', styles['BodyCustom']))

story.append(Paragraph('Recommended Next Actions', styles['Section']))
next_items = [
    'Confirm the deployed site is actually running the latest commit that preserves sslmode=require for legacy DB connections.',
    'Check Vercel function logs for /api/auth/signup after the latest deploy is live.',
    'Re-run fresh-account signup immediately after that deploy.',
    'Keep camera recording in the release checklist, but treat it as currently passing in deployment QA.',
]
story.append(ListFlowable([ListItem(Paragraph(item, styles['BodyCustom'])) for item in next_items], bulletType='1', leftIndent=14))

story.append(Spacer(1, 2 * mm))
story.append(Paragraph('Conclusion: signup is still broken in the current deployed build, but the downstream logged-in creator flow is working.', styles['SmallMuted']))

def add_page_number(canvas, doc):
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(colors.HexColor('#6b7280'))
    canvas.drawRightString(195 * mm, 9 * mm, f'Page {doc.page}')

doc = SimpleDocTemplate(str(out_pdf), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=14 * mm, bottomMargin=14 * mm)
doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
print(out_pdf)
