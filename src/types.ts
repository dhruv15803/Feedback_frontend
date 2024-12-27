import { SetStateAction } from "react";

export type AppContextType = {
    loggedInUser:User | null;
    setLoggedInUser:React.Dispatch<SetStateAction<User | null>>;
    isLoading : boolean;
}

export type User = {
    id:number;
    email:string;
    username:string;
    created_at:string;
    updated_at:string | null;
}

export type Form = {
    id:number;
    form_title:string;
    form_description:string;
    is_ready:boolean;
    user_id:number,
    created_at:string,
    user:User | null,
    form_fields:FormField[] | null,
}

export type FormField = {
    id:number;
    field_title:string;
    required:boolean;
    form_id:number;
}
export type CreateFormRequest = {
    form_title:string;
    form_description:string;
}

export type CreateFieldRequest =  {
    field_title:string;
    required:boolean;
    form_id:number;
}

export type FormResponse = {
    id:number;
    form_id:number;
    respondent_id:number;
    submitted_at:string;
    respondent:User | null;
    form:Form | null
}

export type ResponseField = {
    id: number;
    field_value: string;
    form_response_id: number;
    form_field_id: number;
    form_field: FormField;
};