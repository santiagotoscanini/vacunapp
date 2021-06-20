from abc import ABC
import json

import tornado.web
import tornado.ioloop


class SendSmsRequestHandler(tornado.web.RequestHandler, ABC):
    def post(self, cellphone):
        body = json.loads(self.request.body)

        print(f"""
        ------- SMS enviado a {cellphone} -------
        Código de reserva: {body['reservationCode']}
        Cédula de Identidad: {body['ci']} 
        Información de reserva:
        * Departamento: {body['location']['department']}
        * Zona: {body['location']['zoneId']}
        * Código de vacunatorio: {body['location']['vaccinationCenter']}
        * Fecha: {body['reservationDate']}

        Timestamps:
        * Inicio: {body['timestamps']['begin']}
        * Fin: {body['timestamps']['end']}
        * Diferencia: {body['timestamps']['difference']}
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
