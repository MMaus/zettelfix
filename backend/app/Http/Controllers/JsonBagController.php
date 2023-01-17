<?php

namespace App\Http\Controllers;

use App\Models\JsonBag;
use Illuminate\Http\Request;

class JsonBagController extends Controller {

    // from https://www.php.net/manual/en/class.datetimeinterface.php
    const RFC7231_DATE = "D, d M Y H:i:s \\G\\M\\T";

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
        return JsonBagController::createResponse($bag);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function put(Request $request, string $name) {
        //
        if (json_last_error() != JSON_ERROR_NONE) {
            return response(['message' => 'request body could not be parsed as json received'], 422);
        }
        $sha = hash('sha256', serialize($request->all()));
        // return  $sha

        $bag = $request->user()->bags()->where('name', '=', $name)->get()->first();
        $returnCode = 200;
        if (!$bag) {
            $bag = $request->user()->bags()->create(
                [
                    "content" => $request->all(),
                    'version' => 1,
                    'name' => $name,
                    'sha' => $sha
                ],

            );
            $returnCode = 201;
        } else {
            $givenVersion = $request->header("if-match");
            if ($givenVersion && $givenVersion != "{$bag->version}") {
                return response(['message' => "provided version $givenVersion does not match {$bag->version}"], 412);
            }
            if ($bag->sha != $sha) {
                $bag->update(
                    [
                        'content' => $request->all(),
                        'sha' => $sha,
                        'version' => $bag->version + 1
                    ]
                );
            }
        }
        return JsonBagController::createResponse($bag, $returnCode);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\JsonBag  $jsonBag
     * @return \Illuminate\Http\Response
     */
    public function delete(Request $request, string $name) {
        $bag = $request->user()->bags()->where('name', '=', $name)->get()->first();
        if ($bag) {
            $bag->delete();
            return response(['message' => 'deleted']);
        }
        return response(["message" => "user {$request->user()->name} has no bag $name"], 404);
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
     * 
     * @return \Illuminate\Http\Response
     */
    function createResponse(JsonBag $bag, $code = 200) {
        return response($bag, $code, [
            "ETag" => "{$bag->version}",
            "Last-Modified" => $bag->updated_at->format(self::RFC7231_DATE)
        ]);
    }
}
