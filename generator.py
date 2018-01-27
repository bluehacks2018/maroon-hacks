import random
import json
import urllib2

surnames = ['Santos','Reyes','Cruz','Bautista','Ocampo','Garcia','Mendoza','Torres','Tomas','Andrada','Castillo','Flores','Villanueva','Ramos','Castro','Rivera','Aquino','Navarro','Salazar','Mercado']
names = [ 'Abigail', 'Aiza', 'Alden', 'Amihan', 'Amparo', 'Apolinario', 'Amado', 'Alejandro', 'Andres', 'Armando', 'Angel', 'Antonio', 'Aquilino', 'Arnel', 'Avelino', 'Aaron', 'Abigail', 'Abraham', 'Adonis']
jobs = [ 'Karpintero', 'Elektrisista', 'Kasambahay', 'Taga-alaga', 'Tsuper', 'Kusinero', 'Masonero', 'Mekaniko', 'Tubero' ]
places = [ 'Caloocan, "NCR,  3rd district"', 'Las Pinas, "NCR,  4th district"', 'Makati, "NCR,  4th district"', 'Malabon, "NCR,  3rd district"', 'Mandaluyong, "NCR,  2nd district"', 'Manila, "NCR,  City of Manila,  1st district"', 'Marikina, "NCR,  2nd district"', 'Muntinlupa, "NCR,  4th district"', 'Navotas, "NCR,  3rd district"', 'Paranaque, "NCR,  4th district"', 'Pasay, "NCR,  4th district"', 'Pasig, "NCR,  2nd district"', 'Pateros, "NCR,  4th district"', 'Quezon City, "NCR,  2nd district"', 'San Juan, "NCR,  2nd district"', 'Taguig, "NCR,  4th district"', 'Valenzuela, "NCR,  3rd district"' ]

def random_number():
    num = '09'
    for _ in xrange(9):
        num += str(random.randint(0,9))
    return num

def random_letter():
    num = random.randint(ord('A'), ord('Z'))
    return chr(num)

def random_name():
    return random.choice(names)

def random_surname():
    return random.choice(surnames)

def random_job():
    return random.choice(jobs)

def random_place():
    return random.choice(places)

for _ in xrange(20):
    data = {
        'firstName': random_name(),
        'middleInitial': random_letter(),
        'lastName': random_surname(),
        'contactNumber': random_number(),
        'pin': '1234',
        'streetAddress': '',
        'city': random_place(),
        'job': random_job(),
        'verified': True
    }

    req = urllib2.Request('http://localhost:5000/workers')
    req.add_header('Content-Type', 'application/json')

    response = urllib2.urlopen(req, json.dumps(data))
