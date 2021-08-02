import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductComponent implements OnInit{

    products: Product[] = [];
    cols: any[] = [];
    displayDailog = false;
    isNew = false;
    currId:number;

    productForm: FormGroup = this.fb.group({
        name: [''],
        description: [''],
        price: [''],
        quantity: ['']
    });

    constructor(
        public productService: ProductService,
        private fb: FormBuilder,
        private confirmationService: ConfirmationService
    ) { }


    ngOnInit() {
        this.getAllProducts();

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'description', header: 'Description' },
            { field: 'price', header: 'Price' },
            { field: 'quantity', header: 'Quantity' },
        ];
    }

    getAllProducts() {
        this.productService.getAll().subscribe((data: Product[])=>{
          this.products = data;
        });
    }

    addProduct(){
        this.displayDailog = true;
        this.isNew = true;
    }

    saveProduct(){
        if(this.isNew){
          this.productService.create(this.mapFormValue()).subscribe(
            data => {
              if(data){
                this.getAllProducts();
                this.displayDailog = false;
              }
            },
            error => {
                this.productService.errorHandler(error);
            }
          );
        }
        else{
            this.productService.update(this.mapFormValue().id,this.mapFormValue()).subscribe(
              data => {
                if(data){
                  this.getAllProducts();
                  this.displayDailog = false;
                }
              },
              error => {
                this.productService.errorHandler(error); 
              }
            );
        }
    }

    editProduct(product: Product){
        this.displayDailog = true;
        this.isNew = false;
        this.mapValuesToForm(product);
        this.currId = product.id;
    }

    deleteProduct(product: Product){
        this.confirmationService.confirm({
          message: 'Are you sure that you want to delete this product ?',
          accept: () => {
              this.productService.delete(product.id).subscribe(
                data => {
                  if(data){
                    this.getAllProducts();
                  }
                },
                error => {
                    this.productService.errorHandler(error); 
                }
              );
          }
        });
      }
    
    mapValuesToForm(product: Product){
        this.productForm.patchValue(
          {
            name: product.name,
            description: product.description,
            price: product.price,
            quantity: product.quantity
          },
          { emitEvent: false }
        );
    }

    mapFormValue(){
        let product = new Product();
        let formvalue = this.productForm.value;

        product.id = this.isNew ? this.products[this.products.length - 1].id + 1 : this.currId;
        product.name = formvalue.name;
        product.description = formvalue.description;
        product.price = formvalue.price;
        product.quantity = formvalue.quantity;

        return product;
    }

    dialogHide(){
        this.productForm.patchValue(
            {
              name: '',
              description: '',
              price: 0,
              quantity: 0
            },
            { emitEvent: false }
          );
    }
}