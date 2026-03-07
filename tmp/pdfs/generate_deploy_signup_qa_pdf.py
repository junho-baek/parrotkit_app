from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, ListFlowable, ListItem
from reportlab.lib.utils import ImageReader

base = Path('/Volumes/T7/플젝/deundeunApp/Parrotkit')
out_pdf = base / 'output/pdf/20260307_parrotkit_deploy_signup_qa_report.pdf'
failed = base / 'output/playwright/20260307_deploy_signup_qa/03-signup-after-submit.png'

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='TitleCustom', parent=styles['Title'], fontName='Helvetica-Bold', fontSize=22, leading=28, textColor=colors.HexColor('#111827'), alignment=TA_CENTER, spaceAfter=12))
styles.add(ParagraphStyle(name='Subtitle', parent=styles['BodyText'], fontName='Helvetica', fontSize=10.5, leading=14, textColor=colors.HexColor('#4b5563'), alignment=TA_CENTER, spaceAfter=18))
styles.add(ParagraphStyle(name='Section', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=14, leading=18, textColor=colors.HexColor('#111827'), spaceBefore=10, spaceAfter=8))
styles.add(ParagraphStyle(name='BodyCustom', parent=styles['BodyText'], fontName='Helvetica', fontSize=10.5, leading=15, textColor=colors.HexColor('#1f2937'), spaceAfter=6))
styles.add(ParagraphStyle(name='SmallMuted', parent=styles['BodyText'], fontName='Helvetica', fontSize=9.5, leading=13, textColor=colors.HexColor('#6b7280'), spaceAfter=6))

def fit_image(path: Path, max_width: float, max_height: float):
    img = ImageReader(str(path))
    iw, ih = img.getSize()
    scale = min(max_width / iw, max_height / ih)
    return Image(str(path), width=iw * scale, height=ih * scale)

story = []
story.append(Spacer(1, 8 * mm))
story.append(Paragraph('Parrotkit Deployment Signup QA Report', styles['TitleCustom']))
story.append(Paragraph('Deployment URL: https://parrotkit-deploy.vercel.app/ | Test window: 2026-03-07 21:00 KST', styles['Subtitle']))

story.append(Paragraph('Executive Summary', styles['Section']))
summary_items = [
    'Signup failure was reproduced on the deployed environment.',
    'POST /api/auth/signup returned HTTP 500 and the UI showed Internal server error.',
    'The browser stayed on /signup and no auth state was persisted.',
    'The strongest code-based hypothesis is failure in the legacy DB lookup path used before Supabase signup.',
]
story.append(ListFlowable([ListItem(Paragraph(item, styles['BodyCustom'])) for item in summary_items], bulletType='bullet', start='circle', leftIndent=16))

story.append(Paragraph('Observed Behavior', styles['Section']))
obs_items = [
    'Signup page rendered correctly before submit.',
    'A fresh mailinator account was used to avoid duplicate-user false negatives.',
    'The submit request failed with a generic server-side error rather than a handled validation response.',
    'The issue is isolated to signup because login was separately verified as healthy on the same deployment.',
]
story.append(ListFlowable([ListItem(Paragraph(item, styles['BodyCustom'])) for item in obs_items], bulletType='bullet', start='circle', leftIndent=16))

story.append(Paragraph('Failure Evidence', styles['Section']))
story.append(Paragraph('Captured post-submit error state from the live deployed environment.', styles['BodyCustom']))
story.append(fit_image(failed, 155 * mm, 80 * mm))

story.append(Paragraph('Most Likely Root Cause', styles['Section']))
story.append(Paragraph('The signup route performs a legacy-user existence check before Supabase signup. That helper depends on getDb(), which depends on DATABASE_URL. If DATABASE_URL is missing, invalid, or unreachable in Vercel, signup can throw into the route-level 500 path even though the standard password login path still works for existing users.', styles['BodyCustom']))

story.append(Paragraph('Recommended Next Actions', styles['Section']))
next_items = [
    'Check Vercel env for DATABASE_URL first.',
    'Confirm the deployed DATABASE_URL is valid and reachable from Vercel.',
    'Inspect the Vercel function log for /api/auth/signup to confirm the thrown exception.',
    'Make legacy DB lookup failure non-blocking for new-user signup if that dependency is optional.',
]
story.append(ListFlowable([ListItem(Paragraph(item, styles['BodyCustom'])) for item in next_items], bulletType='1', leftIndent=16))

story.append(Spacer(1, 4 * mm))
story.append(Paragraph('Conclusion: as of 2026-03-07 21:00 KST, deployed signup is broken and currently fails before onboarding begins.', styles['SmallMuted']))

def add_page_number(canvas, doc):
    canvas.setFont('Helvetica', 9)
    canvas.setFillColor(colors.HexColor('#6b7280'))
    canvas.drawRightString(195 * mm, 10 * mm, f'Page {doc.page}')

out_pdf.parent.mkdir(parents=True, exist_ok=True)
doc = SimpleDocTemplate(str(out_pdf), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=16 * mm, bottomMargin=16 * mm)
doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
print(out_pdf)
