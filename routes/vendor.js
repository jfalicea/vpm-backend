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
    (product_name, contract_start_date,contract_length, contract_cancel_leadtime, vendor_id,product_sponsor_id)
    VALUES ($1,$2,$3,$4,$5,$6)
    returning id
    `
    
    const successProductInsert = await db.query(insertProductQuery,[productName, contractStartDate, contractLength, contractCancelLeadtime, vendorNameId, productSponsorId])
    console.log('+++', successProductInsert)
    
  
    
})

module.exports = router;
