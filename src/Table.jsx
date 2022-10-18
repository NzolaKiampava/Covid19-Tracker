import React from 'react'
import './Table.css'
import numeral from "numeral"

function Table({ countries }) {
  return (
    <div className='table'>
      {countries.map(({country, cases}) => (  //destructuring, we have not more to put country.keyname, just the keyname
        <tr>  {/* for coding faster type tr>td*2 */}
            <td>{country}</td>
            <td>
                <strong>{numeral(cases).format("0,0")}</strong>
            </td>
        </tr>
      ))}
    </div>
  )
}

export default Table
