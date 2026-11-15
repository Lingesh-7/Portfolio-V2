import os
import re
from flask import Flask, jsonify, render_template, send_from_directory, request, redirect, flash
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from werkzeug.middleware.proxy_fix import ProxyFix

from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
# Render terminates TLS at its proxy; trust its headers so request.url_root is https.
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)
FLASK_KEY = os.environ.get("FLASK_KEY")
app.config['SECRET_KEY'] = FLASK_KEY

account_sid = os.environ.get("account_sid")
auth_token = os.environ.get("auth_token")
num = os.environ.get("twilio_number")
tonum = os.environ.get("your_phone")

# Twilio client — only built if credentials are present so the app
# still boots (and the contact page still renders) without them.
client = None
if account_sid and auth_token:
    client = Client(account_sid, auth_token)

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/resume")
def resume():
    return send_from_directory("static/resume", "lingesh_resume.pdf", as_attachment=False)


@app.route("/contact")
def contact():
    return render_template("components/contact.html")


@app.route("/send_message", methods=["POST"])
def send_message():
    name = (request.form.get("name") or "").strip()
    email = (request.form.get("email") or "").strip()
    subject = (request.form.get("subject") or "").strip()
    message = (request.form.get("message") or "").strip()

    # Server-side validation mirrors the client-side checks so a
    # request that bypasses JS (or has JS disabled) is still safe.
    if not name or not email or not message or not EMAIL_RE.match(email) or len(message) < 10:
        return redirect("/contact?error=true")

    sms_body = f"New Portfolio Message\nName: {name}\nEmail: {email}\nSubject: {subject or '-'}\nMessage: {message}"

    try:
        if client and num and tonum:
            client.messages.create(body=sms_body, from_=num, to=tonum)
        else:
            # No Twilio configured — log instead of failing silently.
            app.logger.info("Contact form submission (Twilio not configured): %s", sms_body)
        return redirect("/contact?sent=true")
    except TwilioRestException as e:
        app.logger.error("Twilio error sending contact message: %s", e)
        return redirect("/contact?error=true")
    except Exception as e:
        app.logger.error("Unexpected error sending contact message: %s", e)
        return redirect("/contact?error=true")


@app.route("/healthz")
def healthz():
    return jsonify(status="ok")


@app.route("/robots.txt")
def robots_txt():
    return send_from_directory("static", "robots.txt")


@app.route("/sitemap.xml")
def sitemap_xml():
    return send_from_directory("static", "sitemap.xml")


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


@app.errorhandler(500)
def internal_error(e):
    return render_template("404.html"), 500


if __name__ == "__main__":
    debug_mode = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(debug=debug_mode)
