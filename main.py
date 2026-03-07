from flask import Flask, render_template, send_from_directory, request, redirect
import os
from twilio.rest import Client
from flask import Flask, render_template, send_from_directory, request, redirect, flash
from twilio.rest import Client

app=Flask(__name__)
FLASK_KEY=os.environ.get("FLASK_KEY")
app.config['SECRET_KEY'] = FLASK_KEY
account_sid = os.environ.get("account_sid")
auth_token = os.environ.get("auth_token")
num=os.environ.get("twilio_number")
tonum=os.environ.get("your_phone")

# Twilio configuration


client = Client(account_sid, auth_token)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/resume")
def resume():
    return send_from_directory("static/resume", "lingesh_resume.pdf")


# Open contact page
@app.route("/contact")
def contact():
    return render_template("components/contact.html")
@app.route("/send_message", methods=["POST"])
def send_message():

    name = request.form.get("name")
    email = request.form.get("email")
    message = request.form.get("message")

    sms = f"New Portfolio MessageName: {name}Email: {email}Message:{message}"
    print(sms)

    client.messages.create(
        body=sms,
        from_=num,
        to=tonum
    )

    return redirect("/contact?sent=true")

if __name__ == "__main__":
    app.run(debug=True)