import { Router, Request, Response, NextFunction } from 'express';
import { PassportStatic } from 'passport';
import {IUser, User} from '../model/User';
import { Mobile } from '../model/Mobile';
import {CartItem} from "../model/CartItem";
import {Review} from "../model/Review";

export const configureRoutes = (passport: PassportStatic, router: Router): Router => {
    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (error: string | null, user: typeof User) => {
            if (error) {
                res.status(500).send(error);
            } else {
                if (!user) {
                    res.status(400).send('User not found.');
                } else {
                    req.login(user, (err: string | null) => {
                        if (err) {
                            res.status(500).send('Internal server error.');
                        } else {
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });

    router.post('/register', (req: Request, res: Response) => {
        const username = req.body.username;
        const email = req.body.email;
        const name = req.body.name;
        const address = req.body.address;
        const password = req.body.password;

        const admin = false;

        const user = new User({username: username, email: email, name: name, address: address, password: password, admin: admin});
        user.save().then(data => {
            res.status(201).send(data);
        }).catch(error => {
            res.status(500).send(error);
        });
    });

    router.post('/logout', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            })
        } else {
            res.status(401).send('User is not logged in.');
        }
    });

    router.get('/isLoggedIn', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        } else {
            res.status(200).send(false);
        }
    });

    router.get('/isAdmin', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const isAdmin = (req.user as IUser).admin;
            res.status(200).send(isAdmin);
        } else {
            res.status(200).send(false);
        }
    });

    router.get('/getUser', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            if (req.user) {
                const email = (req.user as IUser).email;
                User.findOne({email: email}).then(user => {
                    res.status(200).send(user);
                }).catch(error => {
                    res.status(400).send('User not found.');
                });
            } else {
                res.status(401).send('Missing user data.');
            }
        } else {
            res.status(401).send('User is not logged in.');
        }
    });

    router.post('/updateUser', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const email = (req.user as IUser).email;

            const updatedUser: any = {};
            if (req.body.username) {
                updatedUser.username = req.body.username;
            }
            if ((req.body.name !== undefined) && (req.body.name !== null)) {
                updatedUser.name = req.body.name;
            }
            if ((req.body.address !== undefined) && (req.body.address !== null)) {
                updatedUser.address = req.body.address;
            }

            const query = User.updateOne({'email': email}, {$set: updatedUser});
            query.then(user => {
                res.status(200).send(user);
            }).catch(error => {
                res.status(400).send('User not found.');
            });
        } else {
            res.status(500).send('Internal server error.');
        }
    });

    router.delete('/deleteUser', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const email = (req.user as IUser).email;

            User.deleteOne({email: email}).then(data => {
                res.status(200).send(data);
            }).catch(error => {
                res.status(500).send('Internal server error.');
            });
        } else {
            res.status(401).send('User is not logged in.');
        }
    });

    router.post('/uploadMobile', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            if ((req.user as IUser).admin) {

                const name = req.body.name;
                const modelName = req.body.modelName;
                const company = req.body.company;
                const picture = req.body.picture;
                const price = req.body.price;
                const stock = req.body.stock;
                Mobile.updateOne({modelName: modelName}, {name: name, modelName: modelName, company: company, picture: picture, price: price, stock: stock}, {upsert: true}).then(data => {
                    if (data.upsertedCount === 1) {
                        res.status(201).send(data);
                    } else {
                        res.status(200).send(data);
                    }
                }).catch(error => {
                    res.status(500).send(error);
                });
            } else {
                res.status(401).send('User has no admin privileges.');
            }
        } else {
            res.status(401).send('User is not logged in.');
        }
    });

    router.get('/getAllMobiles/:search?', (req: Request, res: Response) => {
        const search = req.params?.search;

        const filter: any = {};
        if (search !== undefined) {
            filter.name = new RegExp(search.replaceAll(' ', '.*'), 'i');
        }

        Mobile.find(filter).then(mobile => {
            res.status(200).send(mobile);
        }).catch(error => {
            res.status(500).send('Internal server error.');
        });
    });

    router.get('/getMobile/:modelName', (req: Request, res: Response) => {
        const modelName = req.params?.modelName;

        let query = Mobile.findOne({modelName: modelName});
        query.then(mobile => {
            res.status(200).send(mobile);
        }).catch(error => {
            res.status(500).send('Internal server error.');
        });
    });

    router.delete('/deleteMobile/:modelName', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            if ((req.user as IUser).admin) {
                const modelName = req.params.modelName;

                CartItem.deleteMany({ modelName: modelName }).then(data => {
                    console.log('Delete success.');
                }).catch(error => {
                    console.log(error);
                });

                Mobile.deleteOne({ modelName: modelName }).then(data => {
                    if (data.deletedCount !== 0) {
                        res.status(200).send(data);
                    } else {
                        res.status(404).send('Mobile is not found.');
                    }
                }).catch(error => {
                    res.status(500).send('Internal server error.');
                });
            } else {
                res.status(401).send('User has no admin privileges.');
            }
        } else {
            res.status(401).send('User is not logged in.');
        }
    });

    router.get('/getCart', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            if (req.user) {
                const email = (req.user as IUser)['email'];
                CartItem.aggregate([
                    { $match: { userEmail: email } },
                    { $lookup: { from: Mobile.collection.collectionName, localField: 'modelName', foreignField: 'modelName', as: 'mobile' } }
                ]).then((data) => {
                    res.status(200).send(data);
                }).catch(error => {
                    res.status(500).send('Internal server error.');
                });
            } else {
                res.status(401).send('Missing user data.');
            }
        } else {
            res.status(401).send('User is not logged in.');
        }
    });

    router.post('/addToCart', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            console.log('User is logged in.');

            if (req.user) {
                const userEmail = (req.user as IUser)['email'];
                const modelName = req.body.modelName;
                const quantity = parseInt(req.body.quantity as string);

                const mobileQuery = Mobile.findOne({modelName: modelName});

                mobileQuery.then(mobile => {
                    if (mobile !== null) {
                        console.log('Found mobile!');
                        const stock = mobile.get('stock');
                        const newStock = stock - quantity;

                        if (stock >= quantity) {
                            console.log('On Stock!');
                            const query = CartItem.findOne({userEmail: userEmail, modelName: modelName});
                            query.then(cartItem => {
                                if (cartItem !== null) {
                                    console.log('Cart item already exists!');
                                    const currentQuantity = cartItem.get('quantity');
                                    const cartQuantity = currentQuantity + quantity;

                                    CartItem.updateOne({userEmail: userEmail, modelName: modelName}, {quantity: cartQuantity}).then(data => {
                                        console.log('Added to cart');
                                    }).catch(error => {
                                        console.log(error);
                                    });

                                    Mobile.updateOne({modelName: modelName}, {stock: newStock}).then(data => {
                                        console.log('Removed from mobile stock');
                                    }).catch(error => {
                                        console.log(error);
                                    });
                                } else {
                                    console.log('Cart item doesnt exist');
                                    const cartItem = new CartItem({userEmail: userEmail, modelName: modelName, quantity: quantity});
                                    cartItem.save().then(data => {
                                        console.log('Added to cart');
                                        res.status(200).send(data);
                                    }).catch(error => {
                                        console.log(error);
                                        res.status(500).send(error);
                                    });

                                    Mobile.updateOne({modelName: modelName}, {stock: newStock}).then(data => {
                                        console.log('Removed from mobile stock');
                                    }).catch(error => {
                                        console.log(error);
                                    });
                                }
                                res.status(200);
                            }).catch(error => {
                                res.status(500).send('Internal server error.');
                            });
                        } else {
                            res.status(500).send('Not enough items in stock.');
                        }

                    } else {
                        res.status(500).send('Mobile not found.');
                    }
                }).catch(error => {
                    res.status(500).send('Internal server error.');
                });
            }
        } else {
            res.status(401).send('User is not logged in.');
        }
    });

    router.post('/removeFromCart', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            console.log('User is logged in.');

            const userEmail = (req.user as IUser).email;
            const modelName = req.body.modelName;
            const quantity = parseInt(req.body.quantity as string);

            const mobileQuery = Mobile.findOne({modelName: modelName});

            mobileQuery.then(mobile => {
                if (mobile !== null) {
                    console.log('Found mobile!');
                    const stock = mobile.get('stock');
                    const newStock = stock + quantity;

                        const query = CartItem.findOne({userEmail: userEmail, modelName: modelName});
                        query.then(cartItem => {
                            if (cartItem !== null) {

                                console.log('Cart item found!');
                                const currentQuantity = cartItem.get('quantity');
                                const cartQuantity = currentQuantity - quantity;

                                if (cartQuantity <= 0) {
                                    CartItem.deleteOne({userEmail: userEmail, modelName: modelName}).then(data => {
                                        console.log('Removed cart item');
                                    }).catch(error => {
                                        console.log(error);
                                    });

                                    Mobile.updateOne({modelName: modelName}, {stock: newStock}).then(data => {
                                        console.log('Added to mobile stock');
                                    }).catch(error => {
                                        console.log(error);
                                    });
                                } else {
                                    CartItem.updateOne({userEmail: userEmail, modelName: modelName}, {quantity: cartQuantity}).then(data => {
                                        console.log('Removed from cart');
                                    }).catch(error => {
                                        console.log(error);
                                    });

                                    Mobile.updateOne({modelName: modelName}, {stock: newStock}).then(data => {
                                        console.log('Added to mobile stock');
                                    }).catch(error => {
                                        console.log(error);
                                    });
                                }

                                res.status(200);
                            } else {
                                console.log('Cart item doesnt exist!');
                                res.status(500).send('Cart item doesnt exist.');
                            }
                        }).catch(error => {
                            res.status(500).send('Internal server error.');
                        });
                } else {
                    res.status(500).send('Mobile not found.');
                }
            }).catch(error => {
                res.status(500).send('Internal server error.');
            });
        } else {
            res.status(401).send('User is not logged in.');
        }
    });

    router.post('/purchase', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const email = (req.user as IUser).email;

            CartItem.deleteMany({userEmail: email}).then(data => {
                res.status(200).send(data);
            }).catch(error => {
                res.status(500).send('Internal server error.');
            });
        } else {
            res.status(401).send('User is not logged in.');
        }
    });

    router.get('/getReviews/:modelName', (req: Request, res: Response) => {
        const modelName = req.params.modelName;

        Review.aggregate([
            { $match: { modelName: modelName } },
            { $lookup: { from: User.collection.collectionName, localField: 'userEmail', foreignField: 'email', as: 'user' } }
        ]).then((data) => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send('Internal server error.');
        });
    });

    router.post('/addReview', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            if (req.user) {
                const userEmail = (req.user as IUser)['email'];
                const modelName = req.body.modelName;
                const score = parseInt(req.body.score as string);
                const text = req.body.text;

                Review.updateOne({userEmail: userEmail, modelName: modelName}, {userEmail: userEmail, modelName: modelName, score: score, text: text}, {upsert: true}).then((data) => {
                    if (data.upsertedCount === 1) {
                        res.status(201).send(data);
                    } else {
                        res.status(200).send(data);
                    }
                }).catch((error) => {
                    res.status(500).send('Internal server error.');
                });
            } else {

            }
        } else {
            res.status(401).send('User is not logged in.');
        }
    });

    router.delete('/deleteReview', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const userEmail = (req.user as IUser).email;
            const modelName = req.body.modelName;

            Review.deleteOne({userEmail: userEmail, modelName: modelName}).then((data) => {
                res.status(200).send(data);
            }).catch((error) => {
                res.status(500).send('Internal server error.');
            });
        } else {
            res.status(401).send('User is not logged in.');
        }
    });

    router.post('/initUsers', (req: Request, res: Response) => {
        User.bulkSave([
            new User({
                username: 'admin',
                email: 'admin@mobilwebshop.com',
                name: 'Adminisztátor',
                address: '',
                password: 'admin',
                admin: true
            }),
            new User({
                username: 'ivan',
                email: 'ivan@test.com',
                name: 'Bohár Iván',
                address: '6722 Szeged, Dugonics tér 3',
                password: 'password',
                admin: false
            })
        ]).then((data) => {
            res.status(201).send(data);
        }).catch((error) => {
            res.status(500).send('Internal server error.');
        });
    });

    router.post('/initMobiles', (req: Request, res: Response) => {
        Mobile.bulkSave([
            new Mobile({
                name: 'iPhone 11',
                modelName: 'A2111',
                company: 'Apple',
                picture: 'apple-iphone-11.jpg',
                price: 169990,
                stock: 11
            }),
            new Mobile({
                name: 'P30',
                modelName: 'ELE-L29',
                company: 'Huawei',
                picture: 'huawei-p30.jpg',
                price: 81990,
                stock: 3
            }),
            new Mobile({
                name: 'Redmi Note 11 Pro',
                modelName: '2201116TG',
                company: 'Xiaomi',
                picture: 'xiaomi-redmi-note-11-pro.png',
                price: 53990,
                stock: 5
            }),
            new Mobile({
                name: 'Samsung Galaxy A50',
                modelName: 'SM-A505U1',
                company: 'Samsung',
                picture: 'samsung-galaxy-a50.jpg',
                price: 33990,
                stock: 2
            })
        ]).then((data) => {
            res.status(201).send(data);
        }).catch((error) => {
            res.status(500).send('Internal server error.');
        });
    });

    router.post('/initReviews', (req: Request, res: Response) => {
        Review.bulkSave([
            new Review({
                userEmail: 'ivan@test.com',
                modelName: 'SM-A505U1',
                score: 4,
                text: 'Jó belépő kategóriás telefon, csak ajánlani tudom.',
            }),
            new Review({
                userEmail: 'ivan@test.com',
                modelName: 'ELE-L29',
                score: 2,
                text: 'Egy év után nagyon belassult, ezért le kellett cserélnem.'
            })
        ]).then((data) => {
            res.status(201).send(data);
        }).catch((error) => {
            res.status(500).send('Internal server error.');
        });
    });

    return router;
}
