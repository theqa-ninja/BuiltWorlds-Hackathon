function getDataRanges(extremes) {
	let ranges = [];
	for (let dimension in extremes) {
		ranges[dimension] = extremes[dimension].max - extremes[dimension].min;
	}
	return ranges;
}

function getDataExtremes(points) {
	let extremes = [];
	for (let i in data) {
		let point = data[i];
		for (let dimension in point) {
			if ( ! extremes[dimension] ){
				extremes[dimension] = {min: 1000, max: 0};
      }
      extremes[dimension].min = point[dimension] < extremes[dimension].min ? point[dimension] : extremes[dimension].min;
      extremes[dimension].max = point[dimension] > extremes[dimension].max ? point[dimension] : extremes[dimension].max;
		}
	}
	return extremes;
}

function initMeans(k) {
	if ( ! k ){
		k = 3;
	}
	while (k--){
		let mean = [];
		for (let dimension in dataExtremes) {
			mean[dimension] = dataExtremes[dimension].min + ( Math.random() * dataRange[dimension] );
		}
		means.push(mean);
	}
	return means;
}

function makeAssignments(data, mean, assignments) {
  assignments = Array( data.length );
	for (let i in data) {
		let point = data[i];
    let distances = [];
		for (let j in means) {
			let mean = means[j];
			let sum = 0;
			for (let dimension in point) {
				let difference = point[dimension] - mean[dimension];
				difference *= difference;
				sum += difference;
			}
			distances[j] = Math.sqrt(sum);
		}
		assignments[i] = distances.indexOf( Math.min.apply(null, distances) );
  }
  return assignments;
}

function moveMeans(data, means, assignments) {
  makeAssignments(data, measn, assignments);
  let sums = Array( means.length );
	let counts = Array( means.length );
	let moved = false;

	for (let j in means) {
		counts[j] = 0;
		sums[j] = Array( means[j].length );
		for (let dimension in means[j]) {
			sums[j][dimension] = 0;
		}
	}

	for (let point_index in assignments) {
		let mean_index = assignments[point_index];
		let point = data[point_index];
		let mean = means[mean_index];
		counts[mean_index]++;
		for (let dimension in mean){
			sums[mean_index][dimension] += point[dimension];
		}
  }
  
	for (let mean_index in sums){
		if ( counts[mean_index] === 0 ) {
			sums[mean_index] = means[mean_index];
			console.log("Mean with no points");
      console.log(sums[mean_index]);
      console.log('picking new mean')
			for (let dimension in dataExtremes){
				sums[mean_index][dimension] = dataExtremes[dimension].min + ( Math.random() * dataRange[dimension] );
			}
			continue;
		}

		for (let dimension in sums[mean_index]){
			sums[mean_index][dimension] /= counts[mean_index];
		}
	}
  // absolute distance, can be set up for threshold
	if (means.toString() !== sums.toString()){
		moved = true;
	}
	means = sums;
	return moved;
}

export function kMeans(data, interations, k){
  const dataExtremes = getDataExtremes(data);
  const dataRanges = getDataRanges(dataExtremes);
  let means = initMeans(k);
  let assignments = Array( data.length );

  for (let i in interations){
    let moved = moveMeans(data, means, assignments);
    if (!moved) {
      break;
    }
  }

  return assignments;
}