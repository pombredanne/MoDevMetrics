/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */


var Hierarchy={};


// CONVERT FROM AN ARRAY OF OBJECTS WITH A parent_field DEFINED TO A TREE OF
// THE SAME, BUT WITH child_field CONTAINING AN ARRAY OF CHILDREN
// ALL OBJECTS MUST HAVE id_field DEFINED
// RETURNS AN ARRAY OF ROOT NODES.
Hierarchy.fromList=function(args){
	var childList={};
	var roots=[];

	args.from.forall(function(p, i){
		if (p[args.parent_field]!=null){
			var peers=childList[p[args.parent_field]];
			if (!peers){
				peers=[];
				childList[p[args.parent_field]]=peers;
			}//endif
			peers.push(p);
		}else{
			roots.push(p);
		}//endif
	});

	var heir=function(children){
		children.forall(function(child, i){
			var grandchildren=childList[child[args.id_field]];
			if (grandchildren){
				child[args.child_field]=grandchildren;
				heir(grandchildren);
			}//endif
		});
	};
	heir(roots);

	return roots;
};


//EXPECTING CERTAIN PARAMETERS, WILL UPDATE ALL BUGS IN from WITH A descendants_field
Hierarchy.addDescendants=function(args){
	var from=args.from;
	var id_field=args.id_field;
	var children_field=args.children_field;
	var descendants_field=args.descendants_field;

	//CAN NOT HANDLE CYCLES!!
	var getDescendants=function(bug){
		if (bug[descendants_field]!==undefined) return bug[descendants_field];
		if (bug[children_field]===undefined){
			bug[children_field]=[];
		}//endif

		var allD={};//OBJCET TO MAINTAIN JUST ONE RECORD PER BUG
		bug[children_field].forall(function(c, i){
			getDescendants(c).forall(function(d, i){
				allD[d[id_field]]=d;
			});
			allD[c[id_field]]=c;
		});
		bug[descendants_field]=mapAllKey(allD, function(k, v){
			return v;
		});
		return bug[descendants_field];
	};//method

	from.forall(function(v, i){
		getDescendants(c);
	});
};



// HEAVILY ALTERED FROM BELOW
// STILL NO GOOD BECASUE CAN NOT HANDLE CYCLES

// Copyright 2012 Rob Righter (@robrighter)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

//REQUIRES from BE A MAP FROM id_field TO OBJECT
//children_id_field IS THE FIELD THIS LIST OF IDs
Hierarchy.topologicalSort=function(args){
	var graph=args.from;
	var id_field=args.id_field;
	var children_field=args.children_id_field;
//	var children_field="_EDGES";

	//ADD EDGES SO FOLLOWING ALGORITHM WORKS
//	forAllKey(graph, function(k, v){
//		v[children_field]=[];
//		v[children_id_field].forall(function(v, i){
//			v[children_field].push(graph[v]);
//		});
//	});


	var numberOfNodes = Object.keys(graph).length;
	var processed = [];
	var unprocessed = [];
	var queue = [];

	function processList(){
		while(processed.length < numberOfNodes){
			for(var i = 0; i < unprocessed.length; i++){
				var nodeid = unprocessed[i];
				if (graph[nodeid].indegrees === 0){
					queue.push(nodeid);
					unprocessed.splice(i, 1); //Remove this node, its all done.
					i--;//decrement i since we just removed that index from the iterated list;
				}//endif
			}//for

			processStartingPoint(queue.shift());
		}//while
	}//method


	function processStartingPoint(nodeId){
		if (nodeId == undefined){
			throw "You have a cycle!!";
		}
		graph[nodeId][children_field].forall(function(e){
			graph[e].indegrees--;
		});
		processed.push(graph[nodeId]);
	}


	function populateIndegreesAndUnprocessed(){
		forAllKey(graph, function(nodeId, node){
			unprocessed.push(nodeId);
			if (node.indegrees===undefined) node.indegrees = 0;
			if (node[children_field]===undefined) node[children_field]=[];

				if (nodeId=="836963"){
					D.println("");
				}

			node[children_field].forall(function(e){
				if (graph[e]===undefined){
					graph[e]=Map.newInstance(id_field, e);
				}//endif

				if (nodeId==831910 && e==831532) return;	//REMOVE CYCLE (CAN'T HANDLE CYCLES)

				if (graph[e].indegrees===undefined){
					graph[e].indegrees = 1
				} else{
					graph[e].indegrees++;
				}//endif
			});
		});
	}

	populateIndegreesAndUnprocessed();
	processList();

	if (processed.length!=numberOfNodes) D.error("broken");
	return processed;
};//method
