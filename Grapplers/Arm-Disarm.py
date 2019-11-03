import argparse
import json
import requests

# Instantiate the parser
parser = argparse.ArgumentParser(description='M.I.S.T.R.A Arm-Disarm Grappler')

parser.add_argument('--arm', dest='arm', action='store_true')
parser.add_argument('--disarm', dest='arm', action='store_false')
parser.set_defaults(arm=True)

args = parser.parse_args()

fd = open("configs/AXOLOTL.json", 'r')
json_data = json.load(fd)

if (args.arm):
    requests.post(json_data["arm"]["url"], json=json_data["arm"]["data"])
else:
    requests.post(json_data["disarm"]["url"], json=json_data["disarm"]["data"])
