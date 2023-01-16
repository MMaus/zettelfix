<?php

namespace App\Http\Controllers;

use App\Models\JsonBag;
use Illuminate\Http\Request;

class JsonBagController extends Controller {
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request) {
        return $request->user()->bags()->get();
        // return response($request->user());
    }

    public function byName(Request $request, string $name) {
        $bag =  $request->user()->bags()->where("name", "=", $name)->get()->first();
        if (!$bag) {
            return response(["message" => "user {$request->user()->name} has no bag $name"], 404);
        }
        return response($bag);
        // return response($request->user());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function put(Request $request, string $name) {
        //
        $validated = $request->validate([
            "content" => "array|required"
        ]);
        // $bag = JsonBag::where('name', "=", $validated['name'])->get()->first(); //$request->user()->bags()->where('name', $validated['name'])->first();
        $bag = $request->user()->bags()->where('name', '=', $name)->get()->first();
        if (!$bag) {
            $bag = $request->user()->bags()->create([
                "name" => $name,
                "content" => $validated['content'],
                "version" => 1
            ]);
        } else {
            $bag->update(
                [
                    "content" => $validated['content'],
                ]
            );
        }

        return response($bag);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request) {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\JsonBag  $jsonBag
     * @return \Illuminate\Http\Response
     */
    public function show(JsonBag $jsonBag) {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\JsonBag  $jsonBag
     * @return \Illuminate\Http\Response
     */
    public function edit(JsonBag $jsonBag) {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\JsonBag  $jsonBag
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, JsonBag $jsonBag) {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\JsonBag  $jsonBag
     * @return \Illuminate\Http\Response
     */
    public function destroy(JsonBag $jsonBag) {
        //
    }
}
