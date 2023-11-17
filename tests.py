import unittest
import requests

class TestAPIEndpoints(unittest.TestCase):
    base_url = "http://localhost:6060"
    sessionToken = None
    headers = None
    postId = None
    commentId = None
    polloId = None
    ##USER
    def test_01_userSignup(self):
        url = self.base_url + "/userSignUp"
        data = {
            "username": "test",
            "password": "test",
            "email": "test@test.com"
        }
        response = requests.post(url, json=data)
        
        url = self.base_url + "/userLogin"
        data = {
            "username": "test",
            "password": "test"
        }
        response = requests.post(url, json=data)
        TestAPIEndpoints.sessionToken = response.json()["user"]["sessionToken"]
        TestAPIEndpoints.headers = {"authorization": self.sessionToken}
        self.assertEqual(response.status_code, 200)
    
    def test_02_authSessionToken(self):
        url= self.base_url + "/authSessionToken/"+TestAPIEndpoints.sessionToken
        response = requests.get(url)
        self.assertEqual(response.status_code, 200)
    
    # def test_03_resetPassword(self):
    #     url= self.base_url + "/resetPassword"
    #     data = {
    #         "email": "javiereric1309@gmail.com"
    #     }
    #     response = requests.get(url, json=data)
    #     self.assertEqual(response.status_code, 200)

    def test_04_profileBadges(self):
        url= self.base_url + "/profileBadge/1"
        response = requests.patch(url, headers=self.headers)

        self.assertEqual(response.status_code, 200)

    def test_999_deleteUser(self):
        url= self.base_url + "/deleteUser"
        data = {
            "sessionToken": TestAPIEndpoints.sessionToken
        }
        response = requests.get(url, json=data, headers=self.headers)
        self.assertEqual(response.status_code, 200)
    
    ##POST
    def test_06_post(self):
        url = self.base_url + "/post"
        data = {
            "sessionToken": self.sessionToken,
            "title": "test",
            "text": "test"
        }
        response = requests.post(url, json=data)
        self.assertEqual(response.status_code, 200)
    def test_07_getPost(self):
        url = self.base_url + "/getPosts"
        response = requests.get(url,headers=self.headers)
        TestAPIEndpoints.postId = response.json()["posts"][0]["objectId"]
        self.assertEqual(response.status_code, 200)
    def test_08_likePost(self):
        post= self.postId
        url = self.base_url + "/likePost/"+post+"/1"
        response = requests.patch(url, headers=self.headers)
        self.assertEqual(response.status_code, 200)
    def test_09_viewPost(self):
        # router.patch('/view/:postId', controller.viewPost);
        post= self.postId
        url = self.base_url + "/view/"+post
        response = requests.patch(url, headers=self.headers)
        self.assertEqual(response.status_code, 200)
    def test_10_editPost(self):
        # router.patch("/editPost/:postId", controller.editPost);
        post= self.postId
        url = self.base_url + "/editPost/"+post
        data = {
            "title": "test",
            "text": "test"
        }
        response = requests.patch(url, json=data, headers=self.headers)
        self.assertEqual(response.status_code, 200)
    def test_11_report(self):
        # router.patch("/report/:objId/:type", controller.report);
        post= self.postId
        url = self.base_url + "/report/"+post+"/0"
        body = {
            "cause": "test"
        }
        response = requests.patch(url, headers=self.headers, json=body)
        self.assertEqual(response.status_code, 200)
    def test_12_comment(self):
        # router.post("/comment", controller.createComment);
        post= self.postId
        url = self.base_url + "/comment"
        body = {
            "sessionToken": self.sessionToken,
            "postId": post,
            "text": "test"
        }
        response = requests.post(url, json=body)
        self.assertEqual(response.status_code, 200)
    def test_13_getComments(self):
        # router.get("/getComments/:postId", controller.getComment);
        post= self.postId
        url = self.base_url + "/getComments/"+post
        response = requests.get(url, headers=self.headers)
        TestAPIEndpoints.commentId = response.json()["comments"][0]["objectId"]
        self.assertEqual(response.status_code, 200)
    def test_14_likeComment(self):
        # router.patch("/likeComment/:commentId/:like", controller.likeComment);
        comment= self.commentId
        url = self.base_url + "/likeComment/"+comment+"/1"
        response = requests.patch(url, headers=self.headers)
        self.assertEqual(response.status_code, 200)

    def test_15_pollo(self):
        # router.post("/pollo", controller.createPollo);
        post= self.postId
        url = self.base_url + "/pollo"
        body = {
            "sessionToken": self.sessionToken,
            "name": "test",
            "color": 1
        }
        response = requests.post(url, json=body, headers=self.headers)
        
        TestAPIEndpoints.polloId = response.json()["pollo"]["objectId"]
        self.assertEqual(response.status_code, 200)

    def test_16_getPollito(self):
        # router.get("/getPollito/:polloId", controller.getPollito);
        pollo= self.polloId
        url = self.base_url + "/getPollito/"+pollo
        response = requests.get(url, headers=self.headers)
        self.assertEqual(response.status_code, 200)
    def test_17_patchPollito(self):
        # router.patch("/patchPollito/:polloId", controller.patchPollito);
        pollo= self.polloId
        url = self.base_url + "/patchPollito/"+pollo
        body = {
            "nApple": 1,
        }
        response = requests.patch(url, json=body, headers=self.headers)
        self.assertEqual(response.status_code, 200)
    def test_18_nextApple(self):
        # router.patch("/nextApple/:polloId", controller.nextApplePollito);
        pollo= self.polloId
        url = self.base_url + "/nextApple/"+pollo
        body = {
            "nextApple": 1,
        }
        response = requests.patch(url, headers=self.headers, json=body)
        self.assertEqual(response.status_code, 200)
    def test_19_nextStagePollito(self):
        # router.patch("/nextStagePollito/:polloId", controller.nextStagePollito);
        pollo= self.polloId
        url = self.base_url + "/nextStagePollito/"+pollo
        body = {
            "nextStage": 1,
        }
        response = requests.patch(url, headers=self.headers, json=body)
        self.assertEqual(response.status_code, 200)
    def test_20_eggPollito(self):
        # router.patch("/eggPollito", controller.eggPollito);
        url = self.base_url + "/eggPollito"
        body = {
            "nEggs": 1,
        }
        response = requests.patch(url, headers=self.headers, json=body)
        self.assertEqual(response.status_code, 200)


    def test_21_createBadge(self):
        url = self.base_url + "/badgeCreate/" + "2" 
        response = requests.patch(url, headers=self.headers)
        self.assertEqual(response.status_code, 200)

    def test_22_editarPerfil(self):
        url = self.base_url + "/editarPerfil"
        response = requests.patch(url, headers=self.headers)
        body = {
            "colorProfilePicture": 2,
            "idProfilePicture": 4
        }
        
        self.assertEqual(response.status_code, 200);
    


if __name__ == "__main__":
    print("Starting tests")
    unittest.main()
    delete