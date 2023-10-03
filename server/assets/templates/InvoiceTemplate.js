import { header } from "./header.js";
import { footer } from "./footer.js";
export const InvoiceTemplate = (name) => {
   return ` 
   <!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="" xml:lang="">
   <head>
      <title></title>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <br />
      <style type="text/css">
         	p {margin: 0; padding: 0;}	.ft10{font-size:10px;font-family:Times;color:#255f41;}
         	.ft11{font-size:13px;font-family:Times;color:#255f41;}
         	.ft12{font-size:11px;font-family:Times;color:#255f41;}
         	.ft13{font-size:11px;font-family:Times;color:#255f41;}
         	.ft14{font-size:13px;font-family:Times;color:#255f41;}
             .ft145{font-size:15px;font-family:Times;color:#255f41;}
         	.ft15{font-size:22px;font-family:Times;color:#000000;}
         	.ft16{font-size:25px;font-family:Times;color:#255f41;}
         	.ft17{font-size:20px;font-family:Times;color:#255f41;}
         	.ft18{font-size:10px;font-family:Times;color:#000000;}
         	.ft19{font-size:13px;font-family:Times;color:#000000;}
         	.ft110{font-size:13px;font-family:Times;color:#000000;}
         	.ft111{font-size:11px;line-height:21px;font-family:Times;color:#255f41;}
         	.ft112{font-size:11px;line-height:21px;font-family:Times;color:#255f41;}
         	.ft113{font-size:13px;line-height:23px;font-family:Times;color:#000000;}
      </style>
   </head>
   <body bgcolor="#fff" vlink="blue" link="blue" style="size: A4; padding: 5%">
      <div
         style="
            display: flex;
            flex-direction: column;
            justify-content: space-between;
         "
      >
         <div>
            ${header}
            <hr
               style="color: #255f41; height: 2.5px; background-color: #255f41"
            />
            <div
               style="
                  display: flex;
                  flex-direction: row;
                  justify-content: space-between;
               "
            >
               <p style="white-space: nowrap" class="ft12">
                  <b>Attn: ${name}<br />Checkout APAC<br /></b>21 Tg Pagar
                  Rd, #03-01/02<br />Singapore 088444
               </p>
               <p style="white-space: nowrap; padding-top: 2.5%" class="ft14">
                  October 10 2023
               </p>
            </div>
            <hr
               style="color: #255f41; height: 2.5px; background-color: #255f41"
            />
            <table style="width: 100%">
               <tr>
                  <th class="ft145" style="width: 40%; text-align: left">
                     Description
                  </th>
                  <th class="ft145" style="width: 20%">Pax</th>
                  <th class="ft145" style="width: 20%">Price per Pax</th>
                  <th class="ft145" style="width: 20%">Amount SGD</th>
               </tr>
            </table>
            <hr
               style="color: #255f41; height: 2.5px; background-color: #255f41"
            />
            <table style="width: 100%">
               <tr>
                  <th class="ft113" style="width: 40%; text-align: left">
                     <b
                        >Coffee Grounds Scrub Workshop by<br />The
                        Sustainability Project</b
                     >
                     <ul style="padding-top: unset; line-height: 16px">
                        <li class="ft110">Date: 10th Oct 2023</li>
                        <li class="ft110">Time: 4pm to 5pm</li>
                     </ul>
                  </th>
                  <th class="ft113" style="width: 20%">20</th>
                  <th class="ft113" style="width: 20%">$45</th>
                  <th class="ft113" style="width: 20%">$900</th>
               </tr>
            </table>
            <hr
               style="color: #255f41; height: 2.5px; background-color: #255f41"
            />
            <div
               style="
                  display: flex;
                  flex-direction: row;
                  width: 30%;
                  padding-left: 65%;
                  justify-content: space-between;
               "
            >
               <p style="white-space: nowrap" class="ft15">
                  <b>Total price</b>
               </p>
               <p
                  style="white-space: nowrap; align-self: flex-end"
                  class="ft15"
               >
                  <b>$900.00</b>
               </p>
            </div>
         </div>
      </div>
      ${footer}
   </body>
</html>  
`;
};
