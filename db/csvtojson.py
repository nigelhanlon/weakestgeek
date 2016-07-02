#!/usr/bin/python

import csv
import json
from itertools import izip

f = open( 'TheWeakestGeek.csv', 'r' )
reader = csv.reader( f, delimiter='|', quotechar='~' )
keys = ( "question", "answer" )
out = []

for property in reader:
    property = iter( property )
    data = {}
    out = [dict(zip(keys, property)) for property in reader]

outfile = open( 'ac_quiz.json', 'w')
outfile.write( json.dumps(out) )

print "Done."
