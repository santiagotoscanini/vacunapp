from abc import ABC

import tornado.web
import tornado.ioloop

import pandas as pd

df = pd.read_csv('./src/data/population.csv')


class GetInformationByIdRequestHandler(tornado.web.RequestHandler, ABC):
    def get(self, id):
        data = df[df.DocumentId.eq(int(id))].to_numpy().tolist()
        if data:
            data = data[0]
            self.write({
                'id': id, 'name': data[1], 'surname': data[2], 'secondSurname': data[3], 'dateOfBirth': data[4],
                'priority': data[5],
            })
        else:
            self.set_status(404)
            self.finish('{"error":"Id not found"}')


if __name__ == "__main__":
    app = tornado.web.Application([
        (r"/information/([0-9]*)", GetInformationByIdRequestHandler)
    ])
    app.listen(80)
    print('Id provider started...')
    tornado.ioloop.IOLoop.current().start()
