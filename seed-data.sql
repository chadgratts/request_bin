-- create some bins, timestamps start out 1 day apart
INSERT INTO bin (endpoint, updated_at)
  VALUES('jWM187dSQ8xT', '2024-09-15T03:00:00.000Z');

INSERT INTO bin (endpoint, updated_at)
  VALUES('beLAPhQgY9xM', '2024-09-14T03:00:00.000Z');

INSERT INTO bin (endpoint, updated_at)
  VALUES('W8wT4asL1Cu8', '2024-09-13T03:00:00.000Z');

-- while referencing the new bin ids...
WITH new_bin_1 AS (SELECT id FROM bin WHERE endpoint = 'jWM187dSQ8xT')

-- create some requests (get mongo_request_id and mongo_body_id from Mongo)
INSERT INTO request (bin_id, method, path, headers, received_at,
                     mongo_request_id, mongo_body_id)
  VALUES((SELECT id FROM new_bin_1),
         'GET',
         '/',
         'Host: jWM187dSQ8xT.x.domain.com
User-Agent: PostmanRuntime/7.41.0
Accept: */*',
         '2024-09-15T03:30:00.00Z',
         '66e8345a50dddd3cb13b5a49', /* change this - mongo_request_id */
         '66e8345a50dddd3cb13b5a4c'); /* change this - mongo_body_id */

WITH new_bin_1 AS (SELECT id FROM bin WHERE endpoint = 'jWM187dSQ8xT')

INSERT INTO request (bin_id, method, path, headers, received_at,
                     mongo_request_id, mongo_body_id)
  VALUES((SELECT id FROM new_bin_1),
         'POST',
         '/sample/post/request',
         'Host: jWM187dSQ8xT.x.domain.com
Content-Type: application/json
Content-Length: 35
User-Agent: PostmanRuntime/7.32.3
Accept: */*
Cache-Control: no-cache
Postman-Token: iuhgs9824h5u20fhe',
         '2024-09-15T03:35:00.00Z',
         '66e8345a50dddd3cb13b5a4a', /* change this - mongo_request_id */
         '66e8345a50dddd3cb13b5a4d'); /* change this - mongo_body_id */

WITH new_bin_2 AS (SELECT id FROM bin WHERE endpoint = 'beLAPhQgY9xM')

INSERT INTO request (bin_id, method, path, headers, received_at,
                     mongo_request_id, mongo_body_id)
  VALUES((SELECT id FROM new_bin_2),
         'GET',
         '/sample/get/request?id=ddc5f0ed-60ff-4435-abc5-590fafe4a771&timestamp=1544827965&event=delivered',
         'host: beLAPhQgY9xM.x.domain.com
accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7
accept-language: en-US,en;q=0.9
cache-control: no-cache
pragma: no-cache
priority: u=0, i
sec-ch-ua: "Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "macOS"
sec-fetch-dest: document
sec-fetch-mode: navigate
sec-fetch-site: none
sec-fetch-user: ?1
upgrade-insecure-requests: 1
user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36
Accept-Encoding: gzip, deflate, br',
         '2024-09-14T03:45:00.00Z',
         '66e8345a50dddd3cb13b5a4b', /* change this - mongo_request_id */ 
         '66e8345a50dddd3cb13b5a4e'); /* change this - mongo_body_id */