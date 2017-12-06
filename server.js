const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const MongoClient = require('mongodb').MongoClient
const objectID = require('mongodb').ObjectID; // 用來建構MongoDBID物件

var url = 'mongodb://140.112.28.194:27017/CSX2003_02_HW2';


// 設定預設port為 1377，若系統環境有設定port值，則以系統環境為主
app.set('port', (process.env.PORT || 1377))

// 設定靜態資料夾
app.use(express.static('public'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// query 功能
app.get('/query', function(req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var response = {
        result: true,
        data: [{
                id: 0,
                name: "小米路由器",
                price: 399,
                count: 1,
                image: 'http://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E875F0267/pms_1490332273.78529474.png?width=160&height=160'
            },
            {
                id: 1,
                name: "米家全景相機",
                price: 7995,
                count: 1,
                image: 'http://i01.appmifile.com/f/i/g/2016overseas/mijiaquanjingxiangji800.png?width=160&height=160'
            }
        ]
    }

    // TODO 作業二 - 查詢資料       
    // 請將查詢mongodb的程式碼寫在這裡，並改寫下方response，使得查詢結果能送至前端
    MongoClient.connect(url, function(err, db) {
        if (err) {
            response.result = false
            response.message = "資料庫連接失敗，" + err.message
            res.json(response)
            return
        }

        //console.log("資料庫連接成功")
        
        db.collection('B04703033').find().toArray(function(err, docs){
            // 先判斷是否資料查訊是否成功
            if (err) {
                response.result = false
                response.message = "資料查詢失敗，" + err.message
                res.json(response)
                return
            }
            response.result = true
            response.message = "資料查詢成功" 
            response.data = docs
            res.json(response)

            // 將資料庫連線關閉
            db.close()  
        })
        
    })
})
//insert功能
app.post('/insert', function(req, res) {
    var response = {
        result: true,
        data: []
    }

    var data = {
        name: req.body.name,
        price: req.body.price,
        count: req.body.count,
        image: req.body.image
    }

    // TODO 作業二 - 新增資料
    // 請將新增資料的程式碼寫在，使得將client送過來的 data 能寫入至 mongodb 中
    

    MongoClient.connect(url, function(err, db) {
        if (err) {
            response.result = false
            response.message = "資料庫連接失敗，" + err.message
            res.json(response)
            return
        }
       
        db.collection('B04703033').insert(data,function(err, item){
            // 先判斷新增資料是否成功
        if (err) {
            response.result = false
            response.message = "新增資料失敗" + err.message
            res.json(response)
            return
        }
        response.result = true
        response.message = "新增資料成功"
    
        //資料庫連線關閉
        db.close()
        })
    
        res.json(response)
    })
})


//update功能
app.post('/update', function(req, res) {
    var data = {
        _id: req.body._id,
        name: req.body.name,
        price: req.body.price,
    }
    var response = {
        result: true,
        data: data
    }
    
    MongoClient.connect(url, function(err, db) {
        if (err) {
            response.result = false
            response.message = "資料庫連接失敗，" + err.message
            res.json(response)
            return
        }

        // TODO 作業二 - 更新資料
        // 將mongoDB資料中對應的 data.id 找出來，並更新其 name 和 price 資料
        // https://docs.mongodb.com/manual/tutorial/update-documents/
        
        var filter = {
            _id: objectID(data._id)
        }

        var update = {
            name: data.name,
            price: data.price
        }
        
        db.collection('B04703033').update({_id:objectID(data._id)},{$set:{name: data.name,price: data.price}},function(err, docs) {
            // 先判斷是否資料更新是否成功
            if (err) {
                console.log('資料更新失敗')
                return
            }
            console.log('資料更新成功')
    
            // 將資料庫連線關閉
            db.close()
        })


        res.json(response)
    })
})


// delete功能
app.post('/delete', function(req, res) {
    var data = {
        _id: req.body._id,
        name: req.body.name
    }
    var response = {
        result: true,
        data: data
    }


    MongoClient.connect(url, function(err, db) {
        if (err) {
            response.result = false
            response.message = "資料庫連接失敗，" + err.message
            res.json(response)
            return
        }
        // TODO 作業二 - 刪除資料
        // 將ID 的資料 從mongodb中刪除
        // https://docs.mongodb.com/manual/tutorial/remove-documents/

        // 查詢要刪除的ID
        var filter = {
            _id: objectID(data._id)
        }
        db.collection('B04703033').deleteOne(filter,function(err, docs) {
            // 先判斷是否資料刪除是否成功
            if (err) {
                console.log('資料刪除失敗')
                res.json(response)
                return
            }
            console.log(docs)
    
            // 將資料庫連線關閉
            db.close()
        })
        res.json(response)

    })

})

// 啟動且等待連接
app.listen(app.get('port'), function() {
    console.log('Server running at http://127.0.0.1:' + app.get('port'))
})