### Hashing & Salting

Hashing 是用来将一段信息加密成另一段信息，并且是不可逆的。 同样的信息经过加密总是能得到同样的字符串。 数据库中存储密码就需要使用Hashing。

举个例子：
假设用户3通过用户名密码成功登陆了一个网站，这时服务器发给他下面这个token

```
var data = {
  id: 3
};

var token = {
  data,
  hash: SHA256(JSON.stringify(data)).toString()
}
```
用户3通过这个token来和服务器通信，服务器通过验证token中的hash值来确定是否是用户3。 这时如果用户3不坏好意，或者有中间人截获了这个token，他修改token中的用户id，再用同样的算法算出hash值，在发给服务器，这样就成功欺骗了服务器，因此很不安全。

我们可以在服务端这样做：
```
var token = {
  data,
  hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
}
```
这种做法称为salting，只有服务端拥有这个秘密字符串，所以如果别人自己伪造token的话，他没有这个secret，算出来的hash值是无法通过服务端的验证。