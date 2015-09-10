from flask import Flask
from firebase import firebase

FB_URL = 'https://your_storage.firebaseio.com'

app = Flask(__name__)
datastore = firebase.FirebaseApplication(FB_URL, None)

@app.route('/', methods=['POST'])
def dispatcher():
    """
    transactions
    A
    B
    - transaction1
        - name: x
        - possibilities
            - id
                - text: blurb
                - id: #dsd (text message id)
    - transaction2
    """
    # Do some parsing based on Bank Accounts
    # search DB based on name indices
    # run matching algorithm based on name on transaction and text information
    # post some information to firebase
    # add text to firebase use id to store against transaction
    message = request.args
    datastore.post('/messages', message, {'print': 'pretty'}, {'X_FANCY_HEADER': 'VERY FANCY'})
