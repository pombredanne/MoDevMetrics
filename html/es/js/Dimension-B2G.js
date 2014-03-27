/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

importScript("Dimension.js");
importScript("qb/ESQuery.js");

if (!Mozilla) var Mozilla = {"name": "Mozilla", "edges": []};

Dimension.addEdges(true, Mozilla, [
	{"name": "B2G",
		"esfilter": {"or": [
			{"terms": {"cf_blocking_b2g": ["1.3+", "1.4+", "1.3t+", "1.5+", "1.3?", "1.4?", "1.3t?", "1.5?"]}},
			{"term": {"product": "firefox os"}}
		]},
		"edges": [
			{"name": "Markup", "index": "bugs", "isFacet": true, "partitions": [
				{"name": "Unassigned", "style": {"color": "purple"}, "esfilter": {"and":[
					{"term": {"assigned_to": "nobody@mozilla.org"}},
					{"terms": {"cf_blocking_b2g": ["1.3+", "1.4+", "1.3t+", "1.5+"]}}
				]}},
				{"name": "Too Old", "style": {"color": "red"}, "esfilter":  {"and":[
					{"range": {"modified_ts": {"lt": Date.today().add("-week").getMilli()}}},
					{"or":[
						{"terms": {"cf_blocking_b2g": ["1.3+", "1.3t+", "1.4+", "1.3?", "1.3t?", "1.4?"]}}, //DO NOT INCLUDE 1.5
						{"term": {"keywords": "regression"}}
					]}
				]}},
				{"name": "Old", "style": {"color": "orange"}, "esfilter": {"and":[
					{"range": {"modified_ts": {"lt": Date.today().add("-2day").getMilli()}}},
					{"or":[
						{"terms": {"cf_blocking_b2g": ["1.3+", "1.3t+", "1.4+", "1.3?", "1.3t?", "1.4?"]}}, //DO NOT INCLUDE 1.5
						{"term": {"keywords": "regression"}}
					]}
				]}},
				{"name": "Unremarkable", "style": {}, "esfilter": {"matches_all": {}}}
			]},

			{"name":"Team", "isFacet": true, "partitions":[
				{"name":"Performance",
					"esfilter":{"term":{"keyword":"perf"}}
				},
				{"name":"System Front-End", "esfilter":{"and":[
					{"not":{"term":{"keyword":"perf"}}}, //AN UNFORTUNATE REDUNDANCY
					{"term": {"product": "firefox os"}},
					{"terms":{"component":[
						"gaia::browser",
						"gaia::everything.me",
						"gaia::first time experience",
						"gaia::homescreen",
						"gaia::search",
						"gaia::system",
						"gaia::system::browser chrome"
					]}}
				]}},
				{"name": "Productivity", "esfilter": {"and": [
					{"not": {"term": {"keyword": "perf"}}}, //AN UNFORTUNATE REDUNDANCY
					{"term": {"product": "firefox os"}},
					{"terms": {"component": [
						"gaia::e-mail",
						"gaia::clock",
						"gaia::calculator",
						"gaia::calendar",
						"gaia::notes"
					]}}
				]}},
				{"name": "Media", "esfilter": {"and": [
					{"not": {"term": {"keyword": "perf"}}}, //AN UNFORTUNATE REDUNDANCY
					{"term": {"product": "firefox os"}},
					{"terms": {"component": [
						"gaia::camera",
						"gaia::fmradio",
						"gaia::gallery",
						"gaia::music",
						"gaia::video"
					]}}
				]}},
				{"name": "RIL", "esfilter": {"and": [
					{"not": {"term": {"keyword": "perf"}}}, //AN UNFORTUNATE REDUNDANCY
					{"terms": {"component": [
						"ril",
						"nfc",
						"wifi",
						"rtsp"
					]}}
				]}},
				{"name": "System Platform", "esfilter": {"and": [
					{"not": {"term": {"keyword": "perf"}}}, //AN UNFORTUNATE REDUNDANCY
					{"term": {"product": "firefox os"}},
					{"terms": {"component": [
						"gaia::settings",
						"gaia::system::window mgmt",
						"gaia::keyboard",
						"gaia::system::input mgmt",
						"gaia::system::lockscreen"
					]}}
				]}},
				{"name": "Multi-media Platform", "esfilter": {"and": [
					{"not": {"term": {"keyword": "perf"}}}, //AN UNFORTUNATE REDUNDANCY
					{"terms": {"component": [
						"video/audio: recording",
						"video/audio",
						"webrtc",
						"webrtc: video/audio"
					]}}
				]}},
				{"name": "Comms", "esfilter": {"and": [
					{"not": {"term": {"keyword": "perf"}}}, //AN UNFORTUNATE REDUNDANCY
					{"term": {"product": "firefox os"}},
					{"terms": {"component": [
						"dom: contacts",
						"gaia::contacts",
						"gaia::cost control",
						"gaia::dialer",
						"gaia::sms"
					]}}
				]}},
				{"name": "Devices", "esfilter": {"and": [
					{"not": {"term": {"keyword": "perf"}}}, //AN UNFORTUNATE REDUNDANCY
					{"term": {"product": "firefox os"}},
					{"terms": {"component": [
						"audiochannel",
						"bluetooth",
						"hardware",
						"vendcom"
					]}}
				]}},
				{"name": "All Others", "esfilter": {"and": [
					{"not": {"term": {"keyword": "perf"}}}, //AN UNFORTUNATE REDUNDANCY
					{"not": {"terms": {"component": [
						//AN UNFORTUNATE LIST OF EVERYTHING, SHOULD BE AUTO-GENERATED, BUT I NEED A EQUATION SIMPLIFIER
						"gaia::browser",
						"gaia::everything.me",
						"gaia::first time experience",
						"gaia::homescreen",
						"gaia::search",
						"gaia::system",
						"gaia::system::browser chrome",
						"gaia::e-mail",
						"gaia::clock",
						"gaia::calculator",
						"gaia::calendar",
						"gaia::notes",
						"gaia::camera",
						"gaia::fmradio",
						"gaia::gallery",
						"gaia::music",
						"gaia::video",
						"ril",
						"nfc",
						"wifi",
						"rtsp",
						"gaia::settings",
						"gaia::system::window mgmt",
						"gaia::keyboard",
						"gaia::system::input mgmt",
						"gaia::system::lockscreen",
						"video/audio: recording",
						"video/audio",
						"webrtc",
						"webrtc: video/audio",
						"dom: contacts",
						"gaia::contacts",
						"gaia::cost control",
						"gaia::dialer",
						"gaia::sms",
						"audiochannel",
						"bluetooth",
						"hardware",
						"vendcom"
					]}}}
				]}}
			]},

			{"name": "State", "index": "bugs", "isFacet": true,
				"partitions": [
					{"name": "Open - Unassigned", "esfilter": {"and": [
						{"term": {"assigned_to": "nobody@mozilla.org"}},
						{"not": {"term": {"keywords": "regression"}}},
						{"not": {"terms": {"cf_blocking_b2g": ["1.3+", "1.4+", "1.3t+", "1.5+", "1.3?", "1.4?", "1.3t?", "1.5?"]}}}
					]}},
					{"name": "Open - Assigned", "esfilter": {"and": [
						{"not": {"term": {"assigned_to": "nobody@mozilla.org"}}},
						{"not": {"term": {"keywords": "regression"}}},
						{"not": {"terms": {"cf_blocking_b2g": ["1.3+", "1.4+", "1.3t+", "1.5+", "1.3?", "1.4?", "1.3t?", "1.5?"]}}}
					]}},
					{"name": "Nominated", "esfilter": {"and": [
						{"terms": {"cf_blocking_b2g": ["1.3?", "1.4?", "1.3t?", "1.5?"]}},
						{"not": {"term": {"keywords": "regression"}}}
					]}},
					{"name": "Blocker", "esfilter": {"and": [
						{"terms": {"cf_blocking_b2g": ["1.3+", "1.4+", "1.3t+", "1.5+"]}},
						{"not": {"term": {"keywords": "regression"}}}
					]}},
					{"name": "Regression", "esfilter": {"term": {"keywords": "regression"}}}
				]
			},

			{"name": "Project", "index": "bugs", "isFacet": true, "partitions": [
				{"name": "1.3", "esfilter": {"terms": {"cf_blocking_b2g": ["1.3+", "1.3?"]}}},
				{"name": "1.3t", "esfilter": {"terms": {"cf_blocking_b2g": ["1.3t+", "1.3t?"]}}},
				{"name": "1.4", "esfilter": {"terms": {"cf_blocking_b2g": ["1.4+", "1.4?"]}}},
				{"name": "1.5", "esfilter": {"terms": {"cf_blocking_b2g": ["1.5+", "1.5?"]}}},
				{"name": "Untargeted", "esfilter": {"and": [
					{"not": {"terms": {"cf_blocking_b2g": ["1.3+", "1.4+", "1.3t+", "1.5+", "1.3?", "1.4?", "1.3t?", "1.5?"]}}}
				]}}
			]},

			{"name": "FinalState", "index": "bugs", "isFacet": true,
				"partitions": [
					{"name": "Blocker", "esfilter": {"and": [
						{"terms": {"cf_blocking_b2g": ["1.3+", "1.4+", "1.3t+", "1.5+"]}},
						{"not": {"term": {"keywords": "regression"}}}
					]}},
					{"name": "Regression", "esfilter": {"term": {"keywords": "regression"}}},
					{"name": "Targeted", "esfilter":{"and":[
						{"exists":{"field":"target_milestone"}},
						{"or":[
							{"prefix":{"target_milestone":"1.3"}},
							{"prefix":{"target_milestone":"1.4"}},
							{"prefix":{"target_milestone":"1.5"}}
						]}

					]}},
					{"name": "Others", "esfilter":{"match_all":{}}}
				]
			}
		]
	}
]);

