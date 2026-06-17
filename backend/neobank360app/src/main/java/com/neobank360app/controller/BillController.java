package com.neobank360app.controller;

import com.neobank360app.dto.BillRequestDTO;
import com.neobank360app.dto.BillResponseDTO;
import com.neobank360app.service.BillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bills")
public class BillController {

    private final BillService billService;

    public BillController(
            BillService billService
    ) {

        this.billService = billService;
    }

    // =========================================================
    // CREATE BILL
    // =========================================================

    @PostMapping
    public ResponseEntity<BillResponseDTO>
    createBill(

            @Valid
            @RequestBody
            BillRequestDTO request
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        billService.createBill(
                                request
                        )
                );
    }

    // =========================================================
    // GET MY BILLS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<BillResponseDTO>>
    getMyBills() {

        return ResponseEntity.ok(
                billService.getMyBills()
        );
    }

    // =========================================================
    // GET PENDING BILLS
    // =========================================================

    @GetMapping("/pending")
    public ResponseEntity<List<BillResponseDTO>>
    getPendingBills() {

        return ResponseEntity.ok(
                billService.getPendingBills()
        );
    }

    // =========================================================
    // PAY BILL
    // =========================================================

    @PutMapping("/pay/{billId}")
    public ResponseEntity<BillResponseDTO>
    payBill(

            @PathVariable
            Long billId
    ) {

        return ResponseEntity.ok(
                billService.payBill(
                        billId
                )
        );
    }

    // =========================================================
    // DELETE BILL
    // =========================================================

    @DeleteMapping("/{billId}")
    public ResponseEntity<String>
    deleteBill(

            @PathVariable
            Long billId
    ) {

        billService.deleteBill(
                billId
        );

        return ResponseEntity.ok(
                "Bill deleted successfully."
        );
    }
}