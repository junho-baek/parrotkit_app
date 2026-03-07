from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak, ListFlowable, ListItem
from reportlab.lib.utils import ImageReader

base = Path('/Volumes/T7/플젝/deundeunApp/Parrotkit')
out_pdf = base / 'output/pdf/20260307_parrotkit_deploy_login_qa_report.pdf'
shots = {
    'signin': base / 'output/playwright/20260307_deploy_qa/02-signin-form.png',
    'email_success': base / 'output/playwright/20260307_deploy_qa/04-after-submit.png',
    'username_success': base / 'output/playwright/20260307_deploy_qa/06-username-login-after-submit.png',
}

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
story.append(Spacer(1, 10 * mm))
story.append(Paragraph('Parrotkit Deployment Login QA Report', styles['TitleCustom']))
story.append(Paragraph('Deployment URL: https://parrotkit-deploy.vercel.app/ | Test window: 2026-03-07 20:55-20:57 KST', styles['Subtitle']))

story.append(Paragraph('Executive Summary', styles['Section']))
summary_items = [
    'Login failure was not reproduced on the deployed environment.',
    'Email login with the shared smoke-test account returned HTTP 200 and redirected to /interests.',
    'Username login with the same account also returned HTTP 200 and redirected to /interests.',
    'Browser-side token persistence succeeded, indicating the deployed auth flow is working for this account.',
]
story.append(ListFlowable([ListItem(Paragraph(item, styles['BodyCustom'])) for item in summary_items], bulletType='bullet', start='circle', leftIndent=16))
story.append(Spacer(1, 4 * mm))

story.append(Paragraph('Scope', styles['Section']))
story.append(Paragraph('This QA pass covered live page rendering, sign-in form render, email login, username login, redirect behavior, and localStorage token persistence on the deployed Vercel URL.', styles['BodyCustom']))

story.append(Paragraph('Key Finding', styles['Section']))
story.append(Paragraph('The current evidence points away from a generic deployment-wide login failure. If a real user still sees a login issue, it is more likely account-specific, browser-state-specific, or tied to a later post-login step.', styles['BodyCustom']))

story.append(Paragraph('Evidence Overview', styles['Section']))
story.append(Paragraph('The screenshots below were captured from a headed Playwright Chromium session against the live deployment.', styles['BodyCustom']))

story.append(Spacer(1, 3 * mm))
story.append(Paragraph('1. Sign-in page rendered normally', styles['BodyCustom']))
story.append(fit_image(shots['signin'], 170 * mm, 95 * mm))
story.append(Spacer(1, 5 * mm))
story.append(Paragraph('2. Email login reached the post-login interests screen', styles['BodyCustom']))
story.append(fit_image(shots['email_success'], 170 * mm, 95 * mm))

story.append(PageBreak())

story.append(Paragraph('3. Username login also reached the post-login interests screen', styles['Section']))
story.append(fit_image(shots['username_success'], 170 * mm, 105 * mm))
story.append(Spacer(1, 5 * mm))

story.append(Paragraph('Observations', styles['Section']))
obs_items = [
    'POST /api/auth/signin returned HTTP 200 during both email and username login checks.',
    'The browser ended on /interests after both login attempts.',
    'No visible runtime error banner or page crash was observed during the deployed QA pass.',
    'The smoke-test account has no interests yet, so redirecting to /interests is the expected behavior.',
]
story.append(ListFlowable([ListItem(Paragraph(item, styles['BodyCustom'])) for item in obs_items], bulletType='bullet', start='circle', leftIndent=16))

story.append(Paragraph('Risk And Coverage Limits', styles['Section']))
risk_items = [
    'Only the shared smoke-test account was validated.',
    'This pass does not prove that every production account shape will behave the same.',
    'Signup, long-lived refresh, and logout were outside this scope.',
]
story.append(ListFlowable([ListItem(Paragraph(item, styles['BodyCustom'])) for item in risk_items], bulletType='bullet', start='circle', leftIndent=16))

story.append(Paragraph('Recommended Next Actions', styles['Section']))
next_items = [
    'Re-test the exact failing account on the deployed URL and compare its /api/auth/signin response against the smoke-test account.',
    'Use a clean browser profile or incognito session if the failure is not consistently reproducible.',
    'If the failure is account-specific, inspect the Supabase auth user, profiles row, and any legacy migration state for that account.',
]
story.append(ListFlowable([ListItem(Paragraph(item, styles['BodyCustom'])) for item in next_items], bulletType='1', leftIndent=16))

story.append(Spacer(1, 6 * mm))
story.append(Paragraph('Conclusion: as of 2026-03-07 20:57 KST, deployed password login is working for the shared smoke-test account and the originally reported failure remains unconfirmed.', styles['SmallMuted']))

def add_page_number(canvas, doc):
    canvas.setFont('Helvetica', 9)
    canvas.setFillColor(colors.HexColor('#6b7280'))
    canvas.drawRightString(195 * mm, 10 * mm, f'Page {doc.page}')

out_pdf.parent.mkdir(parents=True, exist_ok=True)
doc = SimpleDocTemplate(str(out_pdf), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm, topMargin=16 * mm, bottomMargin=16 * mm)
doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
print(out_pdf)
