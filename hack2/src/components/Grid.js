export default function Grid ( {value, row_i, col_j, newly} ) {
    
    let grid_id = `grid-${row_i}-${col_j}`;
    let value_id = `value-${row_i}-${col_j}`;
    let temp_class_name;
    if ( value === 0 ) {
        value = '';
				temp_class_name = 'grid';
    }
    else {
			if ( newly ) {
        temp_class_name = `school-fade-in grid level-${value}`;
			}
			else {
				temp_class_name = `grid level-${value}`;
			}
    }
		let map = new Map();
		map.set('',"");
		map.set( 2, "NCTU"); 
		map.set( 4, "NYMU"); 
		map.set( 8, "NTU"); 
		map.set( 16, "UCSD"); 
		map.set( 32, "UBC"); 
		map.set( 64, "CUHK"); 
		map.set( 128, "UCLA"); 
		map.set( 256, "NYU");
		map.set( 512, "UCB");
		map.set( 1024, "HKUST"); 
		map.set( 2048, "UTokyo"); 
		map.set( 4096, "Columbia"); 
		map.set( 8192, "Yale"); 
		map.set( 16384,"Cambridge"); 
		map.set( 32768,"Stanford"); 
		map.set( 65536,"MIT");
		// #########################
    // # 1 #2 Modify everything here (including the above one) yourself
    // #########################

    return (
        <td>
            <div className={temp_class_name}  id={grid_id}>
                <div className="school-name" id={value_id}>{map.get(value)}</div>
            </div>
        </td>
    );
}