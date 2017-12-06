$(() => {
    var loader = new Loader($('.loader-wrapper'))

    $('#query').on('click', function() {
        loader.start();
        $.get("http://127.0.0.1:1377/query", function(response) {
            if (response) {
                if (response.result) {
                    $("#product-list").empty()
                    for (var i = 1; i <= response.data.length; i++) {

                        var productPrice = response.data[i - 1].price
                        var productName = response.data[i - 1].name
                        var imgUrl = response.data[i - 1].image
                        var productId = response.data[i - 1]._id


                        var container = $("<div>").addClass("item")
                        var img = $("<img>").addClass("thumb").attr("src", imgUrl)
                        var title = $("<h3>").text(productName).addClass("title")
                        var p = $("<p>").text("NT$" + productPrice).addClass("price")
                        var name = $("<div>").addClass("form-group row edit-row").append($("<label>").addClass("col-sm-2 col-form-label edit-label").append($("<small>").text("名稱")))
                        name.append($("<div>").addClass("col-sm-10 edit-input").append($("<input>").addClass("form-control form-control-sm").attr({ type: "text" })))
                        var price = $("<div>").addClass("form-group row edit-row").append($("<label>").addClass("col-sm-2 col-form-label edit-label").append($("<small>").text("價格")))
                        price.append($("<div>").addClass("col-sm-10 edit-input").append($("<input>").addClass("form-control form-control-sm").attr({ type: "number" })))
                        var $btnEdit = $("<button>").addClass("btn btn-primary btn-sm").append($("<small>").text("確定修改")).attr("data-id", productId)
                        $($btnEdit).on('click', (eventObject) => {
                            $btn = ($(eventObject.target).prop("tagName") == 'SMALL') ? $(eventObject.target).parents('button') : $(eventObject.target)
                            _id = $($btn).attr('data-id')
                            $name = $($btn).parents(".edit-form").find('input')[0]
                            $price = $($btn).parents(".edit-form").find('input')[1]
                            name = $($name).val()
                            price = $($price).val()
                            if (name == "") {
                                showMessage("輸入錯誤", "商品名稱未輸入")
                                return
                            }
                            if (price == "") {
                                showMessage("輸入錯誤", "商品價格未輸入")
                                return
                            }
                            var data = {
                                _id: _id,
                                name: name,
                                price: +price
                            }
                            $.post("/update", data, function(response) {
                                if (response) {
                                    if (response.result) {
                                        showMessage("商品修改", "商品名稱：" + response.data.name + ' 修改成功')

                                    } else {
                                        showMessage("商品修改", '修改失敗 (' + response.data + ')')
                                    }
                                } else {
                                    showMessage("商品修改", '修改失敗')
                                }
                                console.log(response)
                                loader.end()
                                $('#query').click()
                            }, "json")
                        })
                        var $btnCancel = $("<button>").addClass("btn btn-danger btn-sm").append($("<small>").text("取消"))
                        $($btnCancel).on('click', (eventObject) => {
                            $btn = $(eventObject.target)
                            $($btn).parents(".edit-form").hide()
                            $($btn).parents(".item").children(".edit-delete").show()
                        })
                        var form = $("<div>").addClass("edit-form").append(name)
                        form.append(price).append($btnEdit).append($btnCancel)
                        var btnDelete = $("<button>").addClass("btn btn-danger btn-sm").text("刪除").attr("data-id", productId).attr('data-name', productName)

                        $(btnDelete).on("click", (eventObject) => {
                            var data = {
                                _id: $(eventObject.target).attr("data-id"),
                                name: $(eventObject.target).attr("data-name")
                            }
                            loader.start();

                            $.post("/delete", data, function(response) {
                                if (response) {
                                    if (response.result) {

                                        showMessage("商品刪除", '商品名稱：' + response.data.name + ' 刪除成功')

                                    } else {
                                        showMessage("商品刪除", '刪除失敗 (' + response.data + ')')
                                    }
                                } else {
                                    showMessage("商品刪除", '刪除失敗')
                                }
                                console.log(response)
                                loader.end()
                                $('#query').click()
                            }, "json")
                        })


                        var btnUpdate = $("<button>").addClass("btn btn-warning btn-sm").text("編輯")
                        $(btnUpdate).on("click", (eventObject) => {
                            $btn = $(eventObject.target)
                            $($btn).parents(".edit-delete").hide()
                            $($btn).parents(".item").children(".edit-form").show()
                        })
                        var $btn_edit_del = $('<div>').addClass('btn-edit-del').append(btnUpdate).append(btnDelete)
                        container.append(img).append($("<div>").addClass("edit-delete").append(title).append(p).append($btn_edit_del))
                        container.append(form)
                        $("#product-list").append($("<div>").addClass("col-*").append(container))
                        $(".edit-form").hide()
                    }
                } else {
                    showMessage("商品查詢", '查詢失敗(' + response.data + ')')
                }
            } else {
                showMessage("商品查詢", '查詢失敗')
            }
            console.log(response);
            loader.end();
        }, "json");
    })
    $('#insert').on('click', function() {
        var data = {
            name: $('#InputProductName').val(),
            price: +$('#InputProductPrice').val(),
            count: +$('#InputProductCount').val(),
            image: $('#InputProductImage').val()
        }
        loader.start();
        $.post("/insert", data, function(response) {
            if (response) {
                if (response.result) {
                    showMessage("商品新增", '新增成功')
                } else {
                    showMessage("商品新增", '新增失敗 (' + response.data + ')')
                }
            } else {
                showMessage("商品新增", '新增失敗')
            }
            console.log(response)
            loader.end()
        }, "json")
    })
    var showMessage = (title, message) => {
        $('#ModalTitle').text(title)
        $('#message').text(message)
        $('#dialog').modal('show')
    }
    $('#query').click();
});