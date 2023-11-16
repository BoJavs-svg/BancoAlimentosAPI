import unittest
import requests

class TestAPIEndpoints(unittest.TestCase):
    
    base_url = "http://localhost:6060"
    ##USER
    def test_userSignup(self):
        url = self.base_url + "/userSignUp"
        data = {
            "username": "test",
            "password": "test",
            "email": "javiereric1309@gmail.com"
        }
        response = requests.post(url, json=data)
        self.assertEqual(response.status_code, 200)
        self.sessionToken = response.json()["user"]["sessionToken"]
    
    def authSessionToken(self):
        url= self.base_url + "/authSessionToken/"+self.sessionToken
        response = requests.get(url)
        self.assertEqual(response.status_code, 200)
    
    def resetPassword(self):
        url= self.base_url + "/resetPassword"
        data = {
            "email": "javiereric1309@gmail.com"
        }
        response = requests.get(url, json=data)
        self.assertEqual(response.status_code, 200)

    def test_deleteUser(self):
        url= self.base_url + "/deleteUser"
        data = {
            "sessionToken": self.sessionToken
        }
        response = requests.post(url, json=data)
        self.assertEqual(response.status_code, 200)
    
    ##POST
    def test_post(self):
        url = self.base_url + "/post"
        data = {
            "sessionToken": self.sessionToken,
            "title": "test",
            "text": "test"
        }
        response = requests.post(url, json=data)
        self.assertEqual(response.status_code, 200)
    def test_getPost(self):
        url = self.base_url + "/getPosts"
        response = requests.get(url)
        self.assertEqual(response.status_code, 200)
        self.postId = response.json()["posts"][0]["objectId"]
    def test_likePost(self):
        url = self.base_url + "/likePost/"+{self.postId}+"/1"
        response = requests.patch(url)
        self.assertEqual(response.status_code, 200)
    def test_viewPost(self):
        # router.patch('/view/:postId', controller.viewPost);
        url = self.base_url + "/view/"+{self.postId}
        response = requests.patch(url)
        self.assertEqual(response.status_code, 200)
    def test_report(self):
        # router.patch('/report/:postId',controller.report)
        url = self.base_url + "/report/"+{self.postId}
        




    
if __name__ == "__main__":
    print("Starting tests")
    unittest.main()
    