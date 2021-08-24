import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
export const store = new Vuex.Store({
    state: {
        userData: {},
        currentP: 0,
        itemCartCount: 0,
        totalPrice: 0,
        totalWeight: 0,
        totalQty: 0,
        addressBkk: false,
        deliverCompany: {
            price: null,
            name: ''
        },
        optionCompany: [],
        cartItems: []
    },

    mutations: {
        setUser(state, userData) {
            state.userData = userData
        },
        changePage(state, page) {
            state.currentP = page
        },
        removeItemCart(state, index) {
            state.cartItems.splice(index, 1);
            state.itemCartCount = state.cartItems.length
            var total = 0
            var weight = 0
            var qty = 0
            state.cartItems.map(ele => {
                var countW = ele.qty * ele.weight
                weight = weight + countW

                var countQty = ele.qty
                qty = qty + countQty

                var ItemPriceCount = ele.qty * ele.price
                total = total + ItemPriceCount
            })
            state.totalPrice = total
            state.totalWeight = weight
            state.totalQty = qty

            //คำนวณราคาสินค้า
            state.deliverCompany = {
                price: null,
                name: ''
            }

            if (state.totalPrice >= 1000) {
                state.deliverCompany = {
                    price: 0,
                    name: 'KerryExpress'
                }
                state.optionCompany = [
                    {
                        price: 0,
                        name: "KerryExpress",
                        image: ""
                    }
                ]
            } else {
                state.deliverCompany = {
                    price: null,
                    name: ''
                }

                if (state.totalWeight <= 1000 && state.totalQty <= 2) {
                    state.optionCompany = [
                        {
                            price: state.addressBkk ? 35 : 55,
                            name: "KerryExpress",
                            image: "https://cms-tpq.theparq.com/wp-content/uploads/2020/07/Kerry-ORG-logo.png"
                        },
                        {
                            price: state.addressBkk ? 20 : 20,
                            name: "ThailandPost",
                            image: "https://static.thairath.co.th/media/dFQROr7oWzulq5FZUEwvPil4I1YxlMLE0xadqgV7lyEbUhb6tSbx0jW7xbv3O2oYWUU.jpg"
                        },
                        {
                            price: state.addressBkk ? 25 : 35,
                            name: "FlashExpress",
                            image: "https://www.jobbkk.com/upload/employer/06/8D6/02B8D6/images/178390.jpg"
                        },
                        {
                            price: state.addressBkk ? 23 : 30,
                            name: "J&TExpress",
                            image: "https://pbs.twimg.com/profile_images/1084741051141648384/7ay51YTQ.jpg"
                        }

                    ]
                }
                else if (state.totalWeight <= 2000 && state.totalQty <= 5) {
                    state.optionCompany = [
                        {
                            price: state.addressBkk ? 45 : 65,
                            name: "KerryExpress",
                            image: "https://cms-tpq.theparq.com/wp-content/uploads/2020/07/Kerry-ORG-logo.png"
                        },
                        {
                            price: state.addressBkk ? 35 : 35,
                            name: "ThailandPost",
                            image: "https://static.thairath.co.th/media/dFQROr7oWzulq5FZUEwvPil4I1YxlMLE0xadqgV7lyEbUhb6tSbx0jW7xbv3O2oYWUU.jpg"
                        },
                        {
                            price: state.addressBkk ? 35 : 45,
                            name: "FlashExpress",
                            image: "https://www.jobbkk.com/upload/employer/06/8D6/02B8D6/images/178390.jpg"
                        },
                        {
                            price: state.addressBkk ? 39 : 49,
                            name: "J&TExpress",
                            image: "https://pbs.twimg.com/profile_images/1084741051141648384/7ay51YTQ.jpg"
                        }
                    ]
                }
                else if (state.totalWeight <= 3000 && state.totalQty <= 10) {
                    state.optionCompany = [
                        {
                            price: state.addressBkk ? 65 : 80,
                            name: "KerryExpress",
                            image: "https://cms-tpq.theparq.com/wp-content/uploads/2020/07/Kerry-ORG-logo.png"
                        },
                        {
                            price: state.addressBkk ? 50 : 50,
                            name: "ThailandPost",
                            image: "https://static.thairath.co.th/media/dFQROr7oWzulq5FZUEwvPil4I1YxlMLE0xadqgV7lyEbUhb6tSbx0jW7xbv3O2oYWUU.jpg"
                        },
                        {
                            price: state.addressBkk ? 45 : 55,
                            name: "FlashExpress",
                            image: "https://www.jobbkk.com/upload/employer/06/8D6/02B8D6/images/178390.jpg"
                        },
                        {
                            price: state.addressBkk ? 49 : 49,
                            name: "J&TExpress",
                            image: "https://pbs.twimg.com/profile_images/1084741051141648384/7ay51YTQ.jpg"
                        }
                    ]
                }
                else if (state.totalWeight <= 4000 && state.totalQty > 10) {
                    state.optionCompany = [
                        {
                            price: state.addressBkk ? 80 : 90,
                            name: "KerryExpress",
                            image: "https://cms-tpq.theparq.com/wp-content/uploads/2020/07/Kerry-ORG-logo.png"
                        },
                        {
                            price: state.addressBkk ? 65 : 65,
                            name: "ThailandPost",
                            image: "https://static.thairath.co.th/media/dFQROr7oWzulq5FZUEwvPil4I1YxlMLE0xadqgV7lyEbUhb6tSbx0jW7xbv3O2oYWUU.jpg"
                        },
                        {
                            price: state.addressBkk ? 55 : 65,
                            name: "FlashExpress",
                            image: "https://www.jobbkk.com/upload/employer/06/8D6/02B8D6/images/178390.jpg"
                        },
                        {
                            price: state.addressBkk ? 60 : 60,
                            name: "J&TExpress",
                            image: "https://pbs.twimg.com/profile_images/1084741051141648384/7ay51YTQ.jpg"
                        }
                    ]
                } else {
                    state.optionCompany = [
                        {
                            price: state.addressBkk ? 80 : 90,
                            name: "KerryExpress",
                            image: "https://cms-tpq.theparq.com/wp-content/uploads/2020/07/Kerry-ORG-logo.png"
                        },
                        {
                            price: state.addressBkk ? 65 : 65,
                            name: "ThailandPost",
                            image: "https://static.thairath.co.th/media/dFQROr7oWzulq5FZUEwvPil4I1YxlMLE0xadqgV7lyEbUhb6tSbx0jW7xbv3O2oYWUU.jpg"
                        },
                        {
                            price: state.addressBkk ? 55 : 65,
                            name: "FlashExpress",
                            image: "https://www.jobbkk.com/upload/employer/06/8D6/02B8D6/images/178390.jpg"
                        },
                        {
                            price: state.addressBkk ? 60 : 60,
                            name: "J&TExpress",
                            image: "https://pbs.twimg.com/profile_images/1084741051141648384/7ay51YTQ.jpg"
                        }
                    ]
                }

            }

        },
        changeItemQty(state, item) {
            state.cartItems[item.index].qty = item.qty
            var total = 0
            var weight = 0
            var qty = 0
            state.cartItems.map(ele => {
                var countW = ele.qty * ele.weight
                weight = weight + countW

                var countQty = ele.qty
                qty = qty + countQty

                var ItemPriceCount = ele.qty * ele.price
                total = total + ItemPriceCount
            })
            state.totalPrice = total
            state.totalWeight = weight
            state.totalQty = qty


            //คำนวณราคาสินค้า
            state.deliverCompany = {
                price: null,
                name: ''
            }

            if (state.totalPrice >= 1000) {
                state.deliverCompany = {
                    price: 0,
                    name: 'KerryExpress'
                }
                state.optionCompany = [
                    {
                        price: 0,
                        name: "KerryExpress",
                        image: ""
                    }
                ]
            } else {
                state.deliverCompany = {
                    price: null,
                    name: ''
                }

                if (state.totalWeight <= 1000 && state.totalQty <= 2) {
                    state.optionCompany = [
                        {
                            price: state.addressBkk ? 35 : 55,
                            name: "KerryExpress",
                            image: "https://cms-tpq.theparq.com/wp-content/uploads/2020/07/Kerry-ORG-logo.png"
                        },
                        {
                            price: state.addressBkk ? 20 : 20,
                            name: "ThailandPost",
                            image: "https://static.thairath.co.th/media/dFQROr7oWzulq5FZUEwvPil4I1YxlMLE0xadqgV7lyEbUhb6tSbx0jW7xbv3O2oYWUU.jpg"
                        },
                        {
                            price: state.addressBkk ? 25 : 35,
                            name: "FlashExpress",
                            image: "https://www.jobbkk.com/upload/employer/06/8D6/02B8D6/images/178390.jpg"
                        },
                        {
                            price: state.addressBkk ? 23 : 30,
                            name: "J&TExpress",
                            image: "https://pbs.twimg.com/profile_images/1084741051141648384/7ay51YTQ.jpg"
                        }
                    ]
                }
                else if (state.totalWeight <= 2000 && state.totalQty <= 5) {
                    state.optionCompany = [
                        {
                            price: state.addressBkk ? 45 : 65,
                            name: "KerryExpress",
                            image: "https://cms-tpq.theparq.com/wp-content/uploads/2020/07/Kerry-ORG-logo.png"
                        },
                        {
                            price: state.addressBkk ? 35 : 35,
                            name: "ThailandPost",
                            image: "https://static.thairath.co.th/media/dFQROr7oWzulq5FZUEwvPil4I1YxlMLE0xadqgV7lyEbUhb6tSbx0jW7xbv3O2oYWUU.jpg"
                        },
                        {
                            price: state.addressBkk ? 35 : 45,
                            name: "FlashExpress",
                            image: "https://www.jobbkk.com/upload/employer/06/8D6/02B8D6/images/178390.jpg"
                        },
                        {
                            price: state.addressBkk ? 39 : 49,
                            name: "J&TExpress",
                            image: "https://pbs.twimg.com/profile_images/1084741051141648384/7ay51YTQ.jpg"
                        }
                    ]
                }
                else if (state.totalWeight <= 3000 && state.totalQty <= 10) {
                    state.optionCompany = [
                        {
                            price: state.addressBkk ? 65 : 80,
                            name: "KerryExpress",
                            image: "https://cms-tpq.theparq.com/wp-content/uploads/2020/07/Kerry-ORG-logo.png"
                        },
                        {
                            price: state.addressBkk ? 50 : 50,
                            name: "ThailandPost",
                            image: "https://static.thairath.co.th/media/dFQROr7oWzulq5FZUEwvPil4I1YxlMLE0xadqgV7lyEbUhb6tSbx0jW7xbv3O2oYWUU.jpg"
                        },
                        {
                            price: state.addressBkk ? 45 : 55,
                            name: "FlashExpress",
                            image: "https://www.jobbkk.com/upload/employer/06/8D6/02B8D6/images/178390.jpg"
                        },
                        {
                            price: state.addressBkk ? 49 : 49,
                            name: "J&TExpress",
                            image: "https://pbs.twimg.com/profile_images/1084741051141648384/7ay51YTQ.jpg"
                        }
                    ]
                }
                else if (state.totalWeight <= 4000 && state.totalQty > 10) {
                    state.optionCompany = [
                        {
                            price: state.addressBkk ? 80 : 90,
                            name: "KerryExpress",
                            image: "https://cms-tpq.theparq.com/wp-content/uploads/2020/07/Kerry-ORG-logo.png"
                        },
                        {
                            price: state.addressBkk ? 65 : 65,
                            name: "ThailandPost",
                            image: "https://static.thairath.co.th/media/dFQROr7oWzulq5FZUEwvPil4I1YxlMLE0xadqgV7lyEbUhb6tSbx0jW7xbv3O2oYWUU.jpg"
                        },
                        {
                            price: state.addressBkk ? 55 : 65,
                            name: "FlashExpress",
                            image: "https://www.jobbkk.com/upload/employer/06/8D6/02B8D6/images/178390.jpg"
                        },
                        {
                            price: state.addressBkk ? 60 : 60,
                            name: "J&TExpress",
                            image: "https://pbs.twimg.com/profile_images/1084741051141648384/7ay51YTQ.jpg"
                        }
                    ]
                } else {
                    state.optionCompany = [
                        {
                            price: state.addressBkk ? 80 : 90,
                            name: "KerryExpress",
                            image: "https://cms-tpq.theparq.com/wp-content/uploads/2020/07/Kerry-ORG-logo.png"
                        },
                        {
                            price: state.addressBkk ? 65 : 65,
                            name: "ThailandPost",
                            image: "https://static.thairath.co.th/media/dFQROr7oWzulq5FZUEwvPil4I1YxlMLE0xadqgV7lyEbUhb6tSbx0jW7xbv3O2oYWUU.jpg"
                        },
                        {
                            price: state.addressBkk ? 55 : 65,
                            name: "FlashExpress",
                            image: "https://www.jobbkk.com/upload/employer/06/8D6/02B8D6/images/178390.jpg"
                        },
                        {
                            price: state.addressBkk ? 60 : 60,
                            name: "J&TExpress",
                            image: "https://pbs.twimg.com/profile_images/1084741051141648384/7ay51YTQ.jpg"
                        }
                    ]
                }

            }
        },
        addItemCart(state, item) {
            var setData = {
                name: item.name,
                discount: item.discount,
                fullprice: item.discount ? item.price : item.sale,
                price: item.discount ? item.sale : item.price,
                detail: item.detail,
                catagory : item.catagory,
                qty: 1,
                id: item.id,
                stock: item.stock,
                image: item.image,
                productID: item.productID,
                productType: item.productType,
                weight: item.weight,
                rating: (item.rating / item.ratingCount).toFixed(1)
            }
          

            if (state.cartItems.length != 0) {
                // var found = state.cartItems.find(o => o.id === setData.id)
                // if (found === undefined) {
                //     state.cartItems.push(setData)
                // } else {
                //     state.cartItems.filter(ele => {
                //         if (ele.id == setData.id) {
                //             if (ele.qty < ele.stock) {
                //                 ele.qty = ele.qty + 1
                //             }

                //         }

                //     })
                // }
                state.cartItems.findIndex((item) => item.id === setData.id) === -1 && state.cartItems.push(setData);
            } else {
                state.cartItems.push(setData)
            }

            var total = 0
            var weight = 0
            var qty = 0
            state.cartItems.map(ele => {
                var countW = ele.qty * ele.weight
                weight = weight + countW

                var countQty = ele.qty
                qty = qty + countQty

                var ItemPriceCount = ele.qty * ele.price
                total = total + ItemPriceCount
            })
            state.totalPrice = total
            state.totalWeight = weight
            state.totalQty = qty

            state.itemCartCount = state.cartItems.length

            //คำนวณราคาสินค้า
            state.deliverCompany = {
                price: null,
                name: ''
            }
            if (state.totalPrice >= 1000) {
                state.deliverCompany = {
                    price: 0,
                    name: 'KerryExpress'
                }
                state.optionCompany = [
                    {
                        price: 0,
                        name: "KerryExpress",
                        image: ""
                    }
                ]
            } else {
                state.deliverCompany = {
                    price: null,
                    name: ''
                }

                if (state.totalWeight <= 1000 && state.totalQty <= 2) {
                    state.optionCompany = [
                        {
                            price: state.addressBkk ? 35 : 55,
                            name: "KerryExpress",
                            image: "https://cms-tpq.theparq.com/wp-content/uploads/2020/07/Kerry-ORG-logo.png"
                        },
                        {
                            price: state.addressBkk ? 20 : 20,
                            name: "ThailandPost",
                            image: "https://static.thairath.co.th/media/dFQROr7oWzulq5FZUEwvPil4I1YxlMLE0xadqgV7lyEbUhb6tSbx0jW7xbv3O2oYWUU.jpg"
                        },
                        {
                            price: state.addressBkk ? 25 : 35,
                            name: "FlashExpress",
                            image: "https://www.jobbkk.com/upload/employer/06/8D6/02B8D6/images/178390.jpg"
                        },
                        {
                            price: state.addressBkk ? 23 : 30,
                            name: "J&TExpress",
                            image: "https://pbs.twimg.com/profile_images/1084741051141648384/7ay51YTQ.jpg"
                        }
                    ]
                }
                else if (state.totalWeight <= 2000 && state.totalQty <= 5) {
                    state.optionCompany = [
                        {
                            price: state.addressBkk ? 45 : 65,
                            name: "KerryExpress",
                            image: "https://cms-tpq.theparq.com/wp-content/uploads/2020/07/Kerry-ORG-logo.png"
                        },
                        {
                            price: state.addressBkk ? 35 : 35,
                            name: "ThailandPost",
                            image: "https://static.thairath.co.th/media/dFQROr7oWzulq5FZUEwvPil4I1YxlMLE0xadqgV7lyEbUhb6tSbx0jW7xbv3O2oYWUU.jpg"
                        },
                        {
                            price: state.addressBkk ? 35 : 45,
                            name: "FlashExpress",
                            image: "https://www.jobbkk.com/upload/employer/06/8D6/02B8D6/images/178390.jpg"
                        },
                        {
                            price: state.addressBkk ? 39 : 49,
                            name: "J&TExpress",
                            image: "https://pbs.twimg.com/profile_images/1084741051141648384/7ay51YTQ.jpg"
                        }
                    ]
                }
                else if (state.totalWeight <= 3000 && state.totalQty <= 10) {
                    state.optionCompany = [
                        {
                            price: state.addressBkk ? 65 : 80,
                            name: "KerryExpress",
                            image: "https://cms-tpq.theparq.com/wp-content/uploads/2020/07/Kerry-ORG-logo.png"
                        },
                        {
                            price: state.addressBkk ? 50 : 50,
                            name: "ThailandPost",
                            image: "https://static.thairath.co.th/media/dFQROr7oWzulq5FZUEwvPil4I1YxlMLE0xadqgV7lyEbUhb6tSbx0jW7xbv3O2oYWUU.jpg"
                        },
                        {
                            price: state.addressBkk ? 45 : 55,
                            name: "FlashExpress",
                            image: "https://www.jobbkk.com/upload/employer/06/8D6/02B8D6/images/178390.jpg"
                        },
                        {
                            price: state.addressBkk ? 49 : 49,
                            name: "J&TExpress",
                            image: "https://pbs.twimg.com/profile_images/1084741051141648384/7ay51YTQ.jpg"
                        }
                    ]
                }
                else if (state.totalWeight <= 4000 && state.totalQty > 10) {
                    state.optionCompany = [
                        {
                            price: state.addressBkk ? 80 : 90,
                            name: "KerryExpress",
                            image: "https://cms-tpq.theparq.com/wp-content/uploads/2020/07/Kerry-ORG-logo.png"
                        },
                        {
                            price: state.addressBkk ? 65 : 65,
                            name: "ThailandPost",
                            image: "https://static.thairath.co.th/media/dFQROr7oWzulq5FZUEwvPil4I1YxlMLE0xadqgV7lyEbUhb6tSbx0jW7xbv3O2oYWUU.jpg"
                        },
                        {
                            price: state.addressBkk ? 55 : 65,
                            name: "FlashExpress",
                            image: "https://www.jobbkk.com/upload/employer/06/8D6/02B8D6/images/178390.jpg"
                        },
                        {
                            price: state.addressBkk ? 60 : 60,
                            name: "J&TExpress",
                            image: "https://pbs.twimg.com/profile_images/1084741051141648384/7ay51YTQ.jpg"
                        }
                    ]
                } else {
                    state.optionCompany = [
                        {
                            price: state.addressBkk ? 80 : 90,
                            name: "KerryExpress",
                            image: "https://cms-tpq.theparq.com/wp-content/uploads/2020/07/Kerry-ORG-logo.png"
                        },
                        {
                            price: state.addressBkk ? 65 : 65,
                            name: "ThailandPost",
                            image: "https://static.thairath.co.th/media/dFQROr7oWzulq5FZUEwvPil4I1YxlMLE0xadqgV7lyEbUhb6tSbx0jW7xbv3O2oYWUU.jpg"
                        },
                        {
                            price: state.addressBkk ? 55 : 65,
                            name: "FlashExpress",
                            image: "https://www.jobbkk.com/upload/employer/06/8D6/02B8D6/images/178390.jpg"
                        },
                        {
                            price: state.addressBkk ? 60 : 60,
                            name: "J&TExpress",
                            image: "https://pbs.twimg.com/profile_images/1084741051141648384/7ay51YTQ.jpg"
                        }
                    ]
                }

            }
        },
        selectCompany(state, company) {
            var companyData = {
                price: company.price,
                name: company.name
            }
            state.deliverCompany = companyData
        },
        selectAddress(state, address) {
            if (address == 'กรุงเทพมหานคร' || address == 'นครปฐม' || address == 'นนทบุรี' || address == 'ปทุมธานี' || address == 'สมุทรปราการ' || address == 'สมุทรสาคร') {
                state.addressBkk = true
            } else {
                state.addressBkk = false
            }
        },
        clearItem(state, item) {
            state.itemCartCount = 0
            state.totalPrice = 0
            state.cartItems = item
            state.deliverCompany = {
                price: null,
                name: ''
            }
        },

    },
    getters: {
        getUser: state => state.userData,
        getDeliverCompany: state => state.deliverCompany
    },

    actions: {
        changePage(context, page) {
            context.commit('changePage', page)
        },
        removeItemCart(context, index) {
            context.commit('removeItemCart', index)
        },
        changeItemQty(context, item) {
            context.commit('changeItemQty', item)
        },
        addItemCart(context, item) {
            context.commit('addItemCart', item)
        },
        selectCompany(context, company) {
            context.commit('selectCompany', company)
        },
        selectAddress(context, address) {
            context.commit('selectAddress', address)
        },
        clearItem(context, item) {
            context.commit('clearItem', item)
        }
    }

});

