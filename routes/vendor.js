var express = require('express');
var router = express.Router();
const db = require('../db')



/*
*-------------------------------------------------
** INSERT INFO 
name, address, address2, city, zipcode, 
*-------------------------------------------------
*/
router.post('/add', async (req,res,next)=>{
    let msg 
    const {vendorName, address, address2, city,state, zipcode, vendor_contact_person, vendor_phone_number, vendor_fax_number} = req.body
    const insertVendorInfo = `
    INSERT INTO vendor_info
        (vendor_name, address, address2, city, state, zipcode, vendor_contact_person, vendor_phone_number, vendor_fax_number)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    returning id
    `
    try{
        const vendorInputSuccess = await db.query(insertVendorInfo, [vendorName,address,address2,city,state,zipcode,vendor_contact_person, vendor_phone_number, vendor_fax_number])
        if(vendorInputSuccess.length>0){
            msg = 'Your vendor has been inputted successfully.'
            res.json(msg)
        }
    } catch{
        msg = 'something went wrong, please try again later.'
        res.json(msg)
    }   
})
/*
*-------------------------------------------------
** Update Vendor Information 

*-------------------------------------------------
*/
router.put('/add', async (req,res,next)=>{
    res.json('WORK IN PROGRESS')
})
/*
*-------------------------------------------------
** Insert Vendor Product

*-------------------------------------------------
*/
router.post('/vendor-product', async(req, res, body)=>{
    let msg
    console.log('+++',req.body )
    const {productName, contractStartDate, contractLength, contractCancelLeadtime, vendorNameId, productSponsorId} = req.body
    const insertProductQuery = `
    INSERT INTO vendor_product 
    (product_name, contract_start_date,contract_length, contract_cancel_leadtime, vendor_id, product_sponsor_id)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING id, product_name`
    try{
        const successProductInsert = await db.query(insertProductQuery,[productName, contractStartDate, contractLength, contractCancelLeadtime, vendorNameId, productSponsorId])
        const vendorName = await db.query('SELECT vendor_name FROM vendor_info WHERE id = $1', [vendorNameId])
        res.json(`Success! ${vendorName[0].vendor_name} ${successProductInsert[0].product_name} Was added.`)
    } catch{
        res.json('Something went wrong.')
    }
})

module.exports = router;
