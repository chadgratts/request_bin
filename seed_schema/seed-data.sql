-- create some bins, timestamps start out 1 day apart
INSERT INTO bin (endpoint, updated_at)
  VALUES('jwm187dsq8xt', '2024-09-15T03:00:00.000Z');

INSERT INTO bin (endpoint, updated_at)
  VALUES('belaphqgy9xm', '2024-09-14T03:00:00.000Z');

INSERT INTO bin (endpoint, updated_at)
  VALUES('w8wt4asl1cu8', '2024-09-13T03:00:00.000Z');

-- while referencing the new bin ids...
WITH new_bin_1 AS (SELECT id FROM bin WHERE endpoint = 'jwm187dsq8xt')

-- create some requests (get mongo_request_id and mongo_body_id from Mongo)
INSERT INTO request (bin_id, method, path, headers, received_at,
                     mongo_request_id, mongo_body_id)
  VALUES((SELECT id FROM new_bin_1),
         'GET',
         '/',
         'Host: jwm187dsq8xt.domain.com
User-Agent: PostmanRuntime/7.41.0
Accept: */*',
         '2024-09-15T03:30:00.00Z',
         '66ea1dbc28caa4cfd7726c1d', /* change this - mongo_request_id */
         '66ea1dbc28caa4cfd7726c20'); /* change this - mongo_body_id */

WITH new_bin_2 AS (SELECT id FROM bin WHERE endpoint = 'belaphqgy9xm')

INSERT INTO request (bin_id, method, path, headers, received_at,
                     mongo_request_id, mongo_body_id)
  VALUES((SELECT id FROM new_bin_2),
         'POST',
         '/sample/post/request',
         'Host: belaphqgy9xm.domain.com
Content-Type: application/json
Content-Length: 35
User-Agent: PostmanRuntime/7.32.3
Accept: */*
Cache-Control: no-cache
Postman-Token: iuhgs9824h5u20fhe',
         '2024-09-15T03:35:00.00Z',
         '66ea1dbc28caa4cfd7726c1e', /* change this - mongo_request_id */
         '66ea1dbc28caa4cfd7726c21'); /* change this - mongo_body_id */

WITH new_bin_3 AS (SELECT id FROM bin WHERE endpoint = 'w8wt4asl1cu8')

INSERT INTO request (bin_id, method, path, headers, received_at,
                     mongo_request_id, mongo_body_id)
  VALUES((SELECT id FROM new_bin_3),
         'GET',
         '/sample/get/request?id=ddc5f0ed-60ff-4435-abc5-590fafe4a771&timestamp=1544827965&event=delivered',
         'host: w8wt4asl1cu8.domain.com
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
         '66ea1dbc28caa4cfd7726c1f', /* change this - mongo_request_id */ 
         '66ea1dbc28caa4cfd7726c22'); /* change this - mongo_body_id */