var GenerateSchema = require('generate-schema')

function main(){
var schema = GenerateSchema.mongoose(
    {
        "query": {
            "day": "2023-02-28",
            "party_size": 2
        },
        "bookmark": null,
        "results": {
            "venues": [
                {
                    "venue": {
                        "id": {
                            "resy": 60058
                        },
                        "venue_group": {
                            "id": 624,
                            "name": "Hogsalt Admin Group",
                            "venues": [
                                834,
                                4408,
                                4411,
                                4412,
                                4473,
                                5769,
                                7294,
                                10294,
                                54602
                            ]
                        },
                        "name": "Monkey Bar",
                        "type": "American",
                        "url_slug": "monkey-bar-nyc",
                        "price_range": 3,
                        "average_bill_size": 1.0,
                        "currency_symbol": "$",
                        "hospitality_included": 0,
                        "resy_select": 0,
                        "is_gdc": 0,
                        "is_global_dining_access": false,
                        "is_global_dining_access_only": false,
                        "requires_reservation_transfers": 0,
                        "is_gns": 0,
                        "transaction_processor": "stripe",
                        "hide_allergy_question": false,
                        "hide_occasion_question": false,
                        "hide_special_request_question": false,
                        "gda_concierge_booking": false,
                        "tax_included": false,
                        "rating": 4.75977,
                        "total_ratings": 2252,
                        "inventory": {
                            "type": {
                                "id": 2
                            }
                        },
                        "reopen": {
                            "date": "2022-09-07"
                        },
                        "location": {
                            "time_zone": "EST5EDT",
                            "neighborhood": "Midtown East",
                            "geo": {
                                "lat": 40.7606946001054,
                                "lon": -73.9732475153439
                            },
                            "code": "ny",
                            "name": "New York"
                        },
                        "travel_time": {
                            "distance": 2.950935284319231
                        },
                        "source": {
                            "name": null,
                            "logo": null,
                            "terms_of_service": null,
                            "privacy_policy": null
                        },
                        "service_types": {},
                        "top": true,
                        "ticket": {
                            "average": 1.0,
                            "average_str": "$1"
                        },
                        "currency": {
                            "symbol": "$",
                            "code": "USD"
                        },
                        "is_rga": false,
                        "is_rga_only": false,
                        "default_template": "1789463",
                        "responsive_images": {
                            "originals": {
                                "085d799df3d964ad008ae129e0f9e4b34f059baa": {
                                    "url": "https://image.resy.com/3/003/2/60058/085d799df3d964ad008ae129e0f9e4b34f059baa/jpg"
                                }
                            },
                            "urls": {
                                "085d799df3d964ad008ae129e0f9e4b34f059baa": {
                                    "1:1": {
                                        "200": "https://image.resy.com/3/003/2/60058/085d799df3d964ad008ae129e0f9e4b34f059baa/jpg/1:1/200",
                                        "400": "https://image.resy.com/3/003/2/60058/085d799df3d964ad008ae129e0f9e4b34f059baa/jpg/1:1/400",
                                        "800": "https://image.resy.com/3/003/2/60058/085d799df3d964ad008ae129e0f9e4b34f059baa/jpg/1:1/800"
                                    },
                                    "4:3": {
                                        "400": "https://image.resy.com/3/003/2/60058/085d799df3d964ad008ae129e0f9e4b34f059baa/jpg/4:3/400",
                                        "800": "https://image.resy.com/3/003/2/60058/085d799df3d964ad008ae129e0f9e4b34f059baa/jpg/4:3/800"
                                    },
                                    "16:9": {
                                        "400": "https://image.resy.com/3/003/2/60058/085d799df3d964ad008ae129e0f9e4b34f059baa/jpg/16:9/400",
                                        "800": "https://image.resy.com/3/003/2/60058/085d799df3d964ad008ae129e0f9e4b34f059baa/jpg/16:9/800"
                                    }
                                }
                            },
                            "urls_by_resolution": {
                                "085d799df3d964ad008ae129e0f9e4b34f059baa": {
                                    "200": {
                                        "1:1": "https://image.resy.com/3/003/2/60058/085d799df3d964ad008ae129e0f9e4b34f059baa/jpg/1:1/200"
                                    },
                                    "400": {
                                        "1:1": "https://image.resy.com/3/003/2/60058/085d799df3d964ad008ae129e0f9e4b34f059baa/jpg/1:1/400",
                                        "4:3": "https://image.resy.com/3/003/2/60058/085d799df3d964ad008ae129e0f9e4b34f059baa/jpg/4:3/400",
                                        "16:9": "https://image.resy.com/3/003/2/60058/085d799df3d964ad008ae129e0f9e4b34f059baa/jpg/16:9/400"
                                    },
                                    "800": {
                                        "1:1": "https://image.resy.com/3/003/2/60058/085d799df3d964ad008ae129e0f9e4b34f059baa/jpg/1:1/800",
                                        "4:3": "https://image.resy.com/3/003/2/60058/085d799df3d964ad008ae129e0f9e4b34f059baa/jpg/4:3/800",
                                        "16:9": "https://image.resy.com/3/003/2/60058/085d799df3d964ad008ae129e0f9e4b34f059baa/jpg/16:9/800"
                                    }
                                }
                            },
                            "file_names": [
                                "085d799df3d964ad008ae129e0f9e4b34f059baa"
                            ],
                            "aspect_ratios": {
                                "1:1": {
                                    "200": "200x200",
                                    "400": "400x400",
                                    "800": "800x800",
                                    "1600": "1600x1600"
                                },
                                "4:3": {
                                    "400": "400x300",
                                    "800": "800x600",
                                    "1600": "1600x1200"
                                },
                                "16:9": {
                                    "400": "400x225",
                                    "800": "800x450",
                                    "1600": "1600x900"
                                }
                            }
                        },
                        "notify_options": [],
                        "favorite": null,
                        "waitlist": {
                            "available": 0,
                            "label": "Join Wait List",
                            "current": null
                        },
                        "supports_pickups": 0,
                        "collections": [
                            {
                                "id": 883,
                                "type_id": 1,
                                "file_name": "winter",
                                "image": "https://s3.amazonaws.com/resy.com/images/lists/winter.svg",
                                "name": "New York’s Essential Cozy Locales",
                                "short_name": "Cozy Locales",
                                "description": "Your new favorite après-ski (sans the ski) locales — fireplace, snug corners, and heart-warming fare included."
                            },
                            {
                                "id": 1007,
                                "type_id": 1,
                                "file_name": "classic",
                                "image": "https://s3.amazonaws.com/resy.com/images/lists/classic.svg",
                                "name": "The Best of Old New York",
                                "short_name": "Classic Restaurants",
                                "description": "The legacy New York restaurants that have defined the city and stood the test of time."
                            },
                            {
                                "id": 1098,
                                "type_id": 1,
                                "file_name": "bowtie",
                                "image": "https://s3.amazonaws.com/resy.com/images/lists/bowtie.svg",
                                "name": "New York’s Top Pasta Destinations",
                                "short_name": "Pasta Picks",
                                "description": "From bucatini to tortellini, discover the restaurants extruding some of the best fresh pasta in New York."
                            },
                            {
                                "id": 888,
                                "type_id": 2,
                                "file_name": "book-tonight",
                                "image": "https://s3.amazonaws.com/resy.com/images/lists/book-tonight.svg",
                                "name": "Book Tonight",
                                "short_name": "Book Tonight",
                                "description": "Book these venues tonight."
                            },
                            {
                                "id": 889,
                                "type_id": 3,
                                "file_name": "climbing",
                                "image": "https://s3.amazonaws.com/resy.com/images/lists/climbing.svg",
                                "name": "Climbing",
                                "short_name": "Climbing",
                                "description": "You dine, the restaurant climbs. Climbing on Resy is the only data-driven list powered by your reservations. Consider it a curated guide by locals, for locals."
                            },
                            {
                                "id": 890,
                                "type_id": 4,
                                "file_name": "new",
                                "image": "https://s3.amazonaws.com/resy.com/images/lists/new.svg",
                                "name": "New on Resy",
                                "short_name": "New on Resy",
                                "description": "Lucky for you, these restaurants are brand-New on Resy. We've sorted them by popularity because if you know, you know."
                            },
                            {
                                "id": 891,
                                "type_id": 5,
                                "file_name": "toprated",
                                "image": "https://s3.amazonaws.com/resy.com/images/lists/toprated.svg",
                                "name": "Top Rated",
                                "short_name": "Top Rated",
                                "description": "A crowd-sourced stamp of approval. The five-star treatment. Resy's top-rated restaurants according to you, the guests."
                            }
                        ],
                        "content": [
                            {
                                "attribution": null,
                                "body": "As a New York institution that opened in 1936, the Monkey Bar has had its share of the city’s glitz and lore. The red vinyl booths and monkey murals of this swanky Midtown spot have seen everyone from Frank Sinatra to Isadora Duncan, and with the group behind Au Cheval now in charge, you can expect an extravagant menu of steaks, handmade pastas, and classic cocktails executed to the nines.",
                                "display": {
                                    "type": "text"
                                },
                                "icon": {
                                    "url": "https://s3.amazonaws.com/resy.com/images/icons/heart.svg"
                                },
                                "locale": {
                                    "language": "en-us"
                                },
                                "name": "why_we_like_it",
                                "title": null
                            }
                        ],
                        "allow_bypass_payment_method": 1,
                        "events": []
                    },
                    "templates": {
                        "1789463": {
                            "is_paid": false,
                            "venue_share": null,
                            "restriction_id": null,
                            "payment_structure": null,
                            "cancellation_fee": null,
                            "secs_cancel_cut_off": null,
                            "time_cancel_cut_off": null,
                            "secs_change_cut_off": null,
                            "time_change_cut_off": null,
                            "large_party_size_cancel": null,
                            "large_party_cancellation_fee": null,
                            "large_party_secs_cancel_cut_off": null,
                            "large_party_time_cancel_cut_off": null,
                            "large_party_secs_change_cut_off": null,
                            "large_party_time_change_cut_off": null,
                            "deposit_fee": null,
                            "service_charge": null,
                            "service_charge_options": [],
                            "images": [
                                "https://image.resy.com/3/003/2/60058/085d799df3d964ad008ae129e0f9e4b34f059baa/jpg/640x360"
                            ],
                            "raw_image_names": [
                                "085d799df3d964ad008ae129e0f9e4b34f059baa"
                            ],
                            "image_dimensions": [
                                [
                                    1250,
                                    1250
                                ]
                            ],
                            "is_default": 1,
                            "is_event": 0,
                            "is_pickup": 0,
                            "pickup_highlight": 0,
                            "venue_id": 60058,
                            "reservation_config": {
                                "badge": null,
                                "type": "",
                                "secs_off_market": null,
                                "time_off_market": null
                            },
                            "turn_times": [
                                {
                                    "secs_amount": 5400,
                                    "size": {
                                        "max": 1,
                                        "min": 1
                                    }
                                },
                                {
                                    "secs_amount": 5400,
                                    "size": {
                                        "max": 2,
                                        "min": 2
                                    }
                                },
                                {
                                    "secs_amount": 5400,
                                    "size": {
                                        "max": 3,
                                        "min": 3
                                    }
                                },
                                {
                                    "secs_amount": 5400,
                                    "size": {
                                        "max": 4,
                                        "min": 4
                                    }
                                },
                                {
                                    "secs_amount": 5400,
                                    "size": {
                                        "max": null,
                                        "min": 5
                                    }
                                }
                            ],
                            "display_config": {
                                "color": {
                                    "background": null,
                                    "font": null
                                }
                            },
                            "content": {
                                "en-us": {
                                    "about": {
                                        "attribution": null,
                                        "body": "Born in 1936, the heartbeat of Midtown dining with its timeless fare and iconic vibe.\n",
                                        "title": null
                                    },
                                    "need_to_know": {
                                        "attribution": null,
                                        "body": "Monkey Bar accepts reservations up to 14 days in advance with each new day becoming available at 9 AM ET. Reservations are available for parties of 1-8 guests. We kindly ask that you do not make multiple reservations for more than one group. \n\nSeating for walk-in guests is available in the bar area. \n\nA $2.50 per person reservation fee will be added to all reservations made online. This is to secure your seats with us. Holiday fees may vary. We do not charge a reservation fee for walk-in guests.   \n\nReservations are not transferable and we are not obligated to honor transferred reservations.",
                                        "title": null
                                    },
                                    "why_we_like_it": {
                                        "attribution": null,
                                        "body": "As a New York institution that opened in 1936, the Monkey Bar has had its share of the city’s glitz and lore. The red vinyl booths and monkey murals of this swanky Midtown spot have seen everyone from Frank Sinatra to Isadora Duncan, and with the group behind Au Cheval now in charge, you can expect an extravagant menu of steaks, handmade pastas, and classic cocktails executed to the nines.",
                                        "title": null
                                    }
                                }
                            },
                            "id": 1789463,
                            "menu": {},
                            "name": "UPDATED_DEFAULT_TEMPLATE",
                            "item_ids": [],
                            "menu_ids": []
                        }
                    },
                    "slots": [],
                    "notifies": [],
                    "pickups": {
                        "slots": [],
                        "service_types": {}
                    }
                }
            ],
            "meta": {
                "offset": 1,
                "limit": null
            }
        },
        "guest_token": "COGg58ckzoVEXjvQhzrMgdgILZAbNyrNqISUCs5DiSoNMFE8o5u3CX0G9jSnc1GhAXpCA0vXnnPgDFRu6I3b2GmLrWk6omv4u_BUO0ROnuE=-bba7149fb9efadbf1428853143f1546ce3f362e15af4ec140068c695"
    }
)

console.log(schema);

};

main();