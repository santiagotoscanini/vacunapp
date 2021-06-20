from abc import ABC
import json

import tornado.web
import tornado.ioloop


class SendSmsRequestHandler(tornado.web.RequestHandler, ABC):
    def post(self, cellphone):
        message = json.loads(self.request.body)['message']

        print(f"""
------- SMS enviado a {cellphone} --------
{message}
------------------------------------------
        """)

        self.write("SMS sent")


if __name__ == "__main__":
    app = tornado.web.Application([
        (r"/sms/([0-9]*)", SendSmsRequestHandler)
    ])
    app.listen(80)
    print('SMS provider started...')
    tornado.ioloop.IOLoop.current().start()
