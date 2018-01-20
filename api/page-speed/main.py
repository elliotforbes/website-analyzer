import urllib.request
import os
import time

def lambda_handler(event, context):
    request = urllib.request.Request(event['Url'])
    
    try:
        start_time = time.time()
        urllib.request.urlopen(request)
        end_time = time.time()
        total_time = end_time - start_time
    except urllib.error.HTTPError as e:
        print(e.code)
        print(e.read())
        return str(e)
    else:
        print("{} Was Loaded in {}!".format(event['Url'], total_time))
    
    response = {
        'time': total_time
    }

    return str(response)