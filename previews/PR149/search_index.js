var documenterSearchIndex = {"docs":
[{"location":"transforms/external/#External","page":"External","title":"External","text":"","category":"section"},{"location":"transforms/external/","page":"External","title":"External","text":"Below is the list of transforms that are available in external packages.","category":"page"},{"location":"transforms/external/#[GeoStats.jl](https://github.com/JuliaEarth/GeoStats.jl)","page":"External","title":"GeoStats.jl","text":"","category":"section"},{"location":"transforms/external/","page":"External","title":"External","text":"Transform Description\nTaubinSmoothing Manifold smoothing\nStdCoords Standardization of coordinates\nDetrend Geospatial trend removal","category":"page"},{"location":"transforms/external/#[CoDa.jl](https://github.com/JuliaEarth/CoDa.jl)","page":"External","title":"CoDa.jl","text":"","category":"section"},{"location":"transforms/external/","page":"External","title":"External","text":"Transform Description\nClosure Compositional closure\nRemainder Compositional remainder\nALR Additive log-ratio\nCLR Centered log-ratio\nILR Isometric log-ratio","category":"page"},{"location":"related/#Related-packages","page":"Related packages","title":"Related packages","text":"","category":"section"},{"location":"related/","page":"Related packages","title":"Related packages","text":"FeatureTransforms.jl has transforms, but they are not fully revertible. Some of their transforms such as MeanStdScaling are constructed for a specific table and cannot be inserted in the middle of a pipeline for example.\nAutoMLPipeline.jl relies on the Python stack via PyCall.jl. They provide pipelines with Julia's pipe |> operator and follow a more \"Pythonic\" interface. They do not support general Tables.jl.\nImpute.jl, Cleaner.jl, DataConvenience.jl all have a small set of transforms related to fixing column names as well as other basic transforms that we plan to absorb in the long term.\nDataFramesMeta.jl is a package to manipulate DataFrames.jl tables. It is not intended for statistical transforms such as PCA, Quantile, etc, which rely on complex interactions between the rows and columns of a table. The usage of macros in the package promotes one-shot scripts as opposed to general pipelines that can be passed around to different places in the program.\nQuery.jl is a package to query IterableTables.jl. Similar to other alternatives above, the package is not intended for advanced statistical transforms.\nMLJ.jl is one of the most popular packages for machine learning in Julia. The package provides a facility for readily creating non-branching pipelines which can include supervised learners, as well as the flexibility to create more complicated composite machine learning models using so-called learning networks. These composites have the advantage that the hyper-parameters of the component models appear as nested fields of the composite, which is useful in hyper-parameter optimization.","category":"page"},{"location":"#TableTransforms.jl","page":"Home","title":"TableTransforms.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Transforms and pipelines with tabular data.","category":"page"},{"location":"#Overview","page":"Home","title":"Overview","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"This package provides transforms that are commonly used in statistics and machine learning. It was developed to address specific needs in feature engineering and works with general Tables.jl tables.","category":"page"},{"location":"","page":"Home","title":"Home","text":"Past attempts to model transforms in Julia such as FeatureTransforms.jl served as inspiration for this package. We are happy to absorb any missing transform, and contributions are very welcome.","category":"page"},{"location":"#Features","page":"Home","title":"Features","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Transforms are revertible meaning that one can apply a transform and undo the transformation without having to do all the manual work keeping constants around.\nPipelines can be easily constructed with clean syntax (f1 → f2 → f3) ⊔ (f4 → f5), and they are automatically revertible when the individual transforms are revertible.\nBranches of a pipeline and colwise transforms are run in parallel using multiple threads with the awesome Transducers.jl framework.\nPipelines can be reapplied to unseen \"test\" data using the same cache (e.g. constants) fitted with \"training\" data. For example, a ZScore relies on \"fitting\" μ and σ once at training time.","category":"page"},{"location":"#Rationale","page":"Home","title":"Rationale","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"A common task in statistics and machine learning consists of transforming the variables of a problem to achieve better convergence or to apply methods that rely on multivariate Gaussian distributions. This process can be quite tedious to implement by hand and very error-prone. We provide a consistent and clean API to combine statistical transforms into pipelines.","category":"page"},{"location":"","page":"Home","title":"Home","text":"Although most transforms discussed here come from the statistical domain, our long term vision is more ambitious. We aim to provide a complete user experience with fully-featured pipelines that include standardization of column names, imputation of missing data, and more.","category":"page"},{"location":"#Usage","page":"Home","title":"Usage","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Consider the following table and its corner plot:","category":"page"},{"location":"","page":"Home","title":"Home","text":"using TableTransforms\nusing Plots, PairPlots\nusing Random; Random.seed!(2) # hide\ngr(format=:png) # hide\n\n# example table from PairPlots.jl\nN = 100_000\na = [2randn(N÷2) .+ 6; randn(N÷2)]\nb = [3randn(N÷2); 2randn(N÷2)]\nc = randn(N)\nd = c .+ 0.6randn(N)\ntable = (; a, b, c, d)\n\n# corner plot of original table\ntable |> corner","category":"page"},{"location":"","page":"Home","title":"Home","text":"We can convert the columns to PCA scores:","category":"page"},{"location":"","page":"Home","title":"Home","text":"# convert to PCA scores\ntable |> PCA() |> corner","category":"page"},{"location":"","page":"Home","title":"Home","text":"or to any marginal distribution:","category":"page"},{"location":"","page":"Home","title":"Home","text":"using Distributions\n\n# convert to any Distributions.jl\ntable |> Quantile(dist=Normal()) |> corner","category":"page"},{"location":"","page":"Home","title":"Home","text":"Below is a more sophisticated example with a pipeline that has two parallel branches. The tables produced by these two branches are concatenated horizontally in the final table:","category":"page"},{"location":"","page":"Home","title":"Home","text":"# create a transform pipeline\nf1 = ZScore()\nf2 = Scale()\nf3 = Quantile()\nf4 = Functional(cos)\nf5 = Interquartile()\npipeline = (f1 → f2 → f3) ⊔ (f4 → f5)\n\n# feed data into the pipeline\ntable |> pipeline |> corner","category":"page"},{"location":"","page":"Home","title":"Home","text":"Each branch is a sequence of transforms constructed with the → (\\to<tab>) operator. The branches are placed in parallel with the ⊔ (\\sqcup<tab>) operator.","category":"page"},{"location":"","page":"Home","title":"Home","text":"→\n⊔","category":"page"},{"location":"#TransformsBase.:→","page":"Home","title":"TransformsBase.:→","text":"transform₁ → transform₂ → ⋯ → transformₙ\n\nCreate a SequentialTransform transform with [transform₁, transform₂, …, transformₙ].\n\n\n\n\n\n","category":"function"},{"location":"#TableTransforms.:⊔","page":"Home","title":"TableTransforms.:⊔","text":"transform₁ ⊔ transform₂ ⊔ ⋯ ⊔ transformₙ\n\nCreate a ParallelTableTransform transform with [transform₁, transform₂, …, transformₙ].\n\n\n\n\n\n","category":"function"},{"location":"#Reverting-transforms","page":"Home","title":"Reverting transforms","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"To revert a pipeline or single transform, use the apply and revert functions instead. The function isrevertible can be used to check if a transform is revertible.","category":"page"},{"location":"","page":"Home","title":"Home","text":"TransformsBase.apply\nTransformsBase.revert\nTransformsBase.isrevertible","category":"page"},{"location":"#TransformsBase.apply","page":"Home","title":"TransformsBase.apply","text":"newobject, cache = apply(transform, object)\n\nApply transform on the object. Return the newobject and a cache to revert the transform later.\n\n\n\n\n\n","category":"function"},{"location":"#TransformsBase.revert","page":"Home","title":"TransformsBase.revert","text":"object = revert(transform, newobject, cache)\n\nRevert the transform on the newobject using the cache from the corresponding apply call and return the original object. Only defined when the transform isrevertible.\n\n\n\n\n\n","category":"function"},{"location":"#TransformsBase.isrevertible","page":"Home","title":"TransformsBase.isrevertible","text":"isrevertible(transform)\n\nTells whether or not the transform is revertible, i.e. supports a revert function. Defaults to false for new transform types.\n\n\n\n\n\n","category":"function"},{"location":"","page":"Home","title":"Home","text":"To exemplify the use of these functions, let's create a table:","category":"page"},{"location":"","page":"Home","title":"Home","text":"a = [-1.0, 4.0, 1.6, 3.4]\nb = [1.6, 3.4, -1.0, 4.0]\nc = [3.4, 2.0, 3.6, -1.0]\ntable = (; a, b, c)","category":"page"},{"location":"","page":"Home","title":"Home","text":"Now, let's choose a transform and check that it is revertible:","category":"page"},{"location":"","page":"Home","title":"Home","text":"transform = Center()\nisrevertible(transform)","category":"page"},{"location":"","page":"Home","title":"Home","text":"We apply the transformation to the table and save the cache in a variable:","category":"page"},{"location":"","page":"Home","title":"Home","text":"newtable, cache = apply(transform, table)\nnewtable","category":"page"},{"location":"","page":"Home","title":"Home","text":"Using the cache we can revert the transform:","category":"page"},{"location":"","page":"Home","title":"Home","text":"original = revert(transform, newtable, cache)","category":"page"},{"location":"#Reapplying-transforms","page":"Home","title":"Reapplying transforms","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Finally, it is sometimes useful to reapply a transform that was \"fitted\" with training data to unseen test data. In this case, the cache from a previous apply call is used:","category":"page"},{"location":"","page":"Home","title":"Home","text":"TransformsBase.reapply","category":"page"},{"location":"#TransformsBase.reapply","page":"Home","title":"TransformsBase.reapply","text":"newobject = reapply(transform, object, cache)\n\nReapply the transform to (a possibly different) object using a cache that was created with a previous apply call.\n\n\n\n\n\n","category":"function"},{"location":"","page":"Home","title":"Home","text":"Consider the following example:","category":"page"},{"location":"","page":"Home","title":"Home","text":"traintable = (a = rand(3), b = rand(3), c = rand(3))\ntesttable  = (a = rand(3), b = rand(3), c = rand(3))\n\ntransform = ZScore()\n\n# ZScore transform \"fits\" μ and σ using training data\nnewtable, cache = apply(transform, traintable)\n\n# we can reuse the same values of μ and σ with test data\nnewtable = reapply(transform, testtable, cache)","category":"page"},{"location":"","page":"Home","title":"Home","text":"Note that this result is different from the result returned by the apply function:","category":"page"},{"location":"","page":"Home","title":"Home","text":"newtable, cache = apply(transform, testtable)\nnewtable","category":"page"},{"location":"transforms/builtin/#Built-in","page":"Built-in","title":"Built-in","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"Below is the list of tranforms that are are available in this package.","category":"page"},{"location":"transforms/builtin/#Select","page":"Built-in","title":"Select","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"Select","category":"page"},{"location":"transforms/builtin/#TableTransforms.Select","page":"Built-in","title":"TableTransforms.Select","text":"Select(col₁, col₂, ..., colₙ)\nSelect([col₁, col₂, ..., colₙ])\nSelect((col₁, col₂, ..., colₙ))\n\nThe transform that selects columns col₁, col₂, ..., colₙ.\n\nSelect(col₁ => newcol₁, col₂ => newcol₂, ..., colₙ => newcolₙ)\n\nSelects the columns col₁, col₂, ..., colₙ and rename them to newcol₁, newcol₂, ..., newcolₙ.\n\nSelect(regex)\n\nSelects the columns that match with regex.\n\nExamples\n\nSelect(1, 3, 5)\nSelect([:a, :c, :e])\nSelect((\"a\", \"c\", \"e\"))\nSelect(1 => :x, 3 => :y)\nSelect(:a => :x, :b => :y)\nSelect(\"a\" => \"x\", \"b\" => \"y\")\nSelect(r\"[ace]\")\n\n\n\n\n\n","category":"type"},{"location":"transforms/builtin/#Reject","page":"Built-in","title":"Reject","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"Reject","category":"page"},{"location":"transforms/builtin/#TableTransforms.Reject","page":"Built-in","title":"TableTransforms.Reject","text":"Reject(col₁, col₂, ..., colₙ)\nReject([col₁, col₂, ..., colₙ])\nReject((col₁, col₂, ..., colₙ))\n\nThe transform that discards columns col₁, col₂, ..., colₙ.\n\nReject(regex)\n\nDiscards the columns that match with regex.\n\nExamples\n\nReject(:b, :d, :f)\nReject([\"b\", \"d\", \"f\"])\nReject((2, 4, 6))\nReject(r\"[bdf]\")\n\n\n\n\n\n","category":"type"},{"location":"transforms/builtin/#Rename","page":"Built-in","title":"Rename","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"Rename","category":"page"},{"location":"transforms/builtin/#TableTransforms.Rename","page":"Built-in","title":"TableTransforms.Rename","text":"Rename(:col₁ => :newcol₁, :col₂ => :newcol₂, ..., :colₙ => :newcolₙ)\n\nThe transform that renames col₁, col₂, ..., colₙ to newcol₁, newcol₂, ..., newcolₙ.\n\nExamples\n\nRename(1 => :x, 3 => :y)\nRename(:a => :x, :c => :y)\nRename(\"a\" => \"x\", \"c\" => \"y\")\n\n\n\n\n\n","category":"type"},{"location":"transforms/builtin/#StdNames","page":"Built-in","title":"StdNames","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"StdNames","category":"page"},{"location":"transforms/builtin/#TableTransforms.StdNames","page":"Built-in","title":"TableTransforms.StdNames","text":"StdNames(spec)\n\nStandardizes column names according to given spec. Default to :upper case specification.\n\nSpecs\n\n:upper - Uppercase, e.g. COLUMNNAME\n:camel - Camelcase, e.g. ColumnName\n:snake - Snakecase, e.g. column_name\n\n\n\n\n\n","category":"type"},{"location":"transforms/builtin/#Sort","page":"Built-in","title":"Sort","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"Sort","category":"page"},{"location":"transforms/builtin/#TableTransforms.Sort","page":"Built-in","title":"TableTransforms.Sort","text":"Sort(col₁, col₂, ..., colₙ; kwargs...)\nSort([col₁, col₂, ..., colₙ]; kwargs...)\nSort((col₁, col₂, ..., colₙ); kwargs...)\n\nSort the rows of selected columns col₁, col₂, ..., colₙ by forwarding the kwargs to the sortperm function.\n\nSort(regex; kwargs...)\n\nSort the rows of columns that match with regex.\n\nExamples\n\nSort(:a)\nSort(:a, :c, rev=true)\nSort([1, 3, 5], by=row -> abs.(row))\nSort((\"a\", \"c\", \"e\"))\nSort(r\"[ace]\")\n\n\n\n\n\n","category":"type"},{"location":"transforms/builtin/#Sample","page":"Built-in","title":"Sample","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"Sample","category":"page"},{"location":"transforms/builtin/#TableTransforms.Sample","page":"Built-in","title":"TableTransforms.Sample","text":"Sample(size, [weights]; replace=true, ordered=false, rng=GLOBAL_RNG)\n\nSample size rows of table using weights with or without replacement depending on the option replace. The option ordered can be used to return samples in the same order of the original table.\n\nExamples\n\nSample(1_000)\nSample(1_000, replace=false)\nSample(1_000, replace=false, ordered=true)\n\n# with rng\nusing Random\nrng = MersenneTwister(2)\nSample(1_000, rng=rng)\n\n# with weights\nSample(10, rand(100))\n\n\n\n\n\n","category":"type"},{"location":"transforms/builtin/#Filter","page":"Built-in","title":"Filter","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"Filter","category":"page"},{"location":"transforms/builtin/#TableTransforms.Filter","page":"Built-in","title":"TableTransforms.Filter","text":"Filter(func)\n\nFilters the table returning only the rows where the func returns true.\n\nExamples\n\nFilter(row -> sum(row) > 10)\nFilter(row -> row.a == true && row.b < 30)\n\nNotes\n\nThe schema of the table is preserved by the transform.\n\n\n\n\n\n","category":"type"},{"location":"transforms/builtin/#DropMissing","page":"Built-in","title":"DropMissing","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"DropMissing","category":"page"},{"location":"transforms/builtin/#TableTransforms.DropMissing","page":"Built-in","title":"TableTransforms.DropMissing","text":"DropMissing()\nDropMissing(:)\n\nDrop all rows with missing values in table.\n\nDropMissing(col₁, col₂, ..., colₙ)\nDropMissing([col₁, col₂, ..., colₙ])\nDropMissing((col₁, col₂, ..., colₙ))\n\nDrop all rows with missing values in selected columns col₁, col₂, ..., colₙ.\n\nDropMissing(regex)\n\nDrop all rows with missing values in columns that match with regex.\n\nExamples\n\nDropMissing()\nDropMissing(\"b\", \"c\", \"e\")\nDropMissing([2, 3, 5])\nDropMissing((:b, :c, :e))\nDropMissing(r\"[bce]\")\n\nNotes\n\nThe transform can alter the element type of columns from Union{Missing,T} to T.\n\n\n\n\n\n","category":"type"},{"location":"transforms/builtin/#Replace","page":"Built-in","title":"Replace","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"Replace","category":"page"},{"location":"transforms/builtin/#TableTransforms.Replace","page":"Built-in","title":"TableTransforms.Replace","text":"Replace(old₁ => new₁, old₂ => new₂, ..., oldₙ => newₙ)\n\nReplaces oldᵢ value with newᵢ value in the table.\n\nExamples\n\nReplace(1 => -1, 5 => -5)\nReplace(1 => 1.5, 5 => 5.5, 4 => true)\n\n\n\n\n\n","category":"type"},{"location":"transforms/builtin/#Coalesce","page":"Built-in","title":"Coalesce","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"Coalesce","category":"page"},{"location":"transforms/builtin/#TableTransforms.Coalesce","page":"Built-in","title":"TableTransforms.Coalesce","text":"Coalesce(; value)\n\nReplaces all missing values from the table with value.\n\nCoalesce(col₁, col₂, ..., colₙ; value)\nCoalesce([col₁, col₂, ..., colₙ]; value)\nCoalesce((col₁, col₂, ..., colₙ); value)\n\nReplaces all missing values from the columns col₁, col₂, ..., colₙ with value.\n\nCoalesce(regex; value)\n\nReplaces all missing values from the columns that match with regex with value.\n\nExamples\n\nCoalesce(value=0)\nCoalesce(1, 3, 5, value=1)\nCoalesce([:a, :c, :e], value=2)\nCoalesce((\"a\", \"c\", \"e\"), value=3)\nCoalesce(r\"[ace]\", value=4)\n\nNotes\n\nThe transform can alter the element type of columns from Union{Missing,T} to T.\n\n\n\n\n\n","category":"type"},{"location":"transforms/builtin/#Coerce","page":"Built-in","title":"Coerce","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"Coerce","category":"page"},{"location":"transforms/builtin/#TableTransforms.Coerce","page":"Built-in","title":"TableTransforms.Coerce","text":"Coerce(pairs, tight=false, verbosity=1)\n\nReturn a copy of the table, ensuring that the scientific types of the columns match the new specification.\n\nThis transform wraps the ScientificTypes.coerce function. Please see their docstring for more details.\n\nExamples\n\nusing ScientificTypes\nCoerce(:col1 => Continuous, :col2 => Count)\n\n\n\n\n\n","category":"type"},{"location":"transforms/builtin/#Levels","page":"Built-in","title":"Levels","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"Levels","category":"page"},{"location":"transforms/builtin/#TableTransforms.Levels","page":"Built-in","title":"TableTransforms.Levels","text":"Levels(col₁ => levels₁, col₂ => levels₂, ..., colₙ => levelsₙ; ordered=nothing)\n\nConvert columns col₁, col₂, ..., colₙ to categorical arrays with given levels levels₁, levels₂, ..., levelsₙ. Optionally, specify which columns are ordered.\n\nExamples\n\nLevels(1 => 1:3, 2 => [\"a\", \"b\"], ordered=r\"a\")\nLevels(:a => 1:3, :b => [\"a\", \"b\"], ordered=[:a])\nLevels(\"a\" => 1:3, \"b\" => [\"a\", \"b\"], ordered=[\"b\"])\n\n\n\n\n\n","category":"type"},{"location":"transforms/builtin/#OneHot","page":"Built-in","title":"OneHot","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"OneHot","category":"page"},{"location":"transforms/builtin/#TableTransforms.OneHot","page":"Built-in","title":"TableTransforms.OneHot","text":"OneHot(col)\n\nTransforms categorical column col into one-hot columns of levels returned by the levels function of CategoricalArrays.jl.\n\nExamples\n\nOneHot(1)\nOneHot(:a)\nOneHot(\"a\")\n\n\n\n\n\n","category":"type"},{"location":"transforms/builtin/#Identity","page":"Built-in","title":"Identity","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"Identity","category":"page"},{"location":"transforms/builtin/#TransformsBase.Identity","page":"Built-in","title":"TransformsBase.Identity","text":"Identity()\n\nThe identity transform that maps any object to itself.\n\n\n\n\n\n","category":"type"},{"location":"transforms/builtin/#Center","page":"Built-in","title":"Center","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"Center","category":"page"},{"location":"transforms/builtin/#TableTransforms.Center","page":"Built-in","title":"TableTransforms.Center","text":"Center()\n\nApplies the center transform to all columns of the table. The center transform of the column x, with mean μ, is defined by x .- μ.\n\nCenter(col₁, col₂, ..., colₙ)\nCenter([col₁, col₂, ..., colₙ])\nCenter((col₁, col₂, ..., colₙ))\n\nApplies the Center transform on columns col₁, col₂, ..., colₙ.\n\nCenter(regex)\n\nApplies the Center transform on columns that match with regex.\n\nExamples\n\nCenter(1, 3, 5)\nCenter([:a, :c, :e])\nCenter((\"a\", \"c\", \"e\"))\nCenter(r\"[ace]\")\n\n\n\n\n\n","category":"type"},{"location":"transforms/builtin/#Scale","page":"Built-in","title":"Scale","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"Scale","category":"page"},{"location":"transforms/builtin/#TableTransforms.Scale","page":"Built-in","title":"TableTransforms.Scale","text":"Scale(; low=0.25, high=0.75)\n\nApplies the Scale transform to all columns of the table. The scale transform of the column x is defined by (x .- xl) ./ (xh - xl), where xl = quantile(x, low) and xh = quantile(x, high).\n\nScale(col₁, col₂, ..., colₙ; low=0.25, high=0.75)\nScale([col₁, col₂, ..., colₙ]; low=0.25, high=0.75)\nScale((col₁, col₂, ..., colₙ); low=0.25, high=0.75)\n\nApplies the Scale transform on columns col₁, col₂, ..., colₙ.\n\nScale(regex; low=0.25, high=0.75)\n\nApplies the Scale transform on columns that match with regex.\n\nExamples\n\nScale()\nScale(low=0, high=1)\nScale(low=0.3, high=0.7)\nScale(1, 3, 5, low=0, high=1)\nScale([:a, :c, :e], low=0.3, high=0.7)\nScale((\"a\", \"c\", \"e\"), low=0.25, high=0.75)\nScale(r\"[ace]\", low=0.3, high=0.7)\n\nNotes\n\nThe low and high values are restricted to the interval [0, 1].\n\n\n\n\n\n","category":"type"},{"location":"transforms/builtin/#MinMax","page":"Built-in","title":"MinMax","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"MinMax","category":"page"},{"location":"transforms/builtin/#TableTransforms.MinMax","page":"Built-in","title":"TableTransforms.MinMax","text":"MinMax()\n\nApplies the MinMax transform to all columns of the table. The MinMax transform is equivalent to Scale(low=0, high=1).\n\nMinMax(col₁, col₂, ..., colₙ)\nMinMax([col₁, col₂, ..., colₙ])\nMinMax((col₁, col₂, ..., colₙ))\n\nApplies the MinMax transform on columns col₁, col₂, ..., colₙ.\n\nMinMax(regex)\n\nApplies the MinMax transform on columns that match with regex.\n\nExamples\n\nMinMax(1, 3, 5)\nMinMax([:a, :c, :e])\nMinMax((\"a\", \"c\", \"e\"))\nMinMax(r\"[ace]\")\n\nSee also Scale.\n\n\n\n\n\n","category":"function"},{"location":"transforms/builtin/#Interquartile","page":"Built-in","title":"Interquartile","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"Interquartile","category":"page"},{"location":"transforms/builtin/#TableTransforms.Interquartile","page":"Built-in","title":"TableTransforms.Interquartile","text":"Interquartile()\n\nApplies the Interquartile transform to all columns of the table. The Interquartile transform is equivalent to Scale(low=0.25, high=0.75).\n\nInterquartile(col₁, col₂, ..., colₙ)\nInterquartile([col₁, col₂, ..., colₙ])\nInterquartile((col₁, col₂, ..., colₙ))\n\nApplies the Interquartile transform on columns col₁, col₂, ..., colₙ.\n\nInterquartile(regex)\n\nApplies the Interquartile transform on columns that match with regex.\n\nExamples\n\nInterquartile(1, 3, 5)\nInterquartile([:a, :c, :e])\nInterquartile((\"a\", \"c\", \"e\"))\nInterquartile(r\"[ace]\")\n\nSee also Scale.\n\n\n\n\n\n","category":"function"},{"location":"transforms/builtin/#ZScore","page":"Built-in","title":"ZScore","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"ZScore","category":"page"},{"location":"transforms/builtin/#TableTransforms.ZScore","page":"Built-in","title":"TableTransforms.ZScore","text":"ZScore()\n\nApplies the z-score transform (a.k.a. normal score) to all columns of the table. The z-score transform of the column x, with mean μ and standard deviation σ, is defined by (x .- μ) ./ σ.\n\nZScore(col₁, col₂, ..., colₙ)\nZScore([col₁, col₂, ..., colₙ])\nZScore((col₁, col₂, ..., colₙ))\n\nApplies the ZScore transform on columns col₁, col₂, ..., colₙ.\n\nZScore(regex)\n\nApplies the ZScore transform on columns that match with regex.\n\nExamples\n\nZScore(1, 3, 5)\nZScore([:a, :c, :e])\nZScore((\"a\", \"c\", \"e\"))\nZScore(r\"[ace]\")\n\n\n\n\n\n","category":"type"},{"location":"transforms/builtin/#Quantile","page":"Built-in","title":"Quantile","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"Quantile","category":"page"},{"location":"transforms/builtin/#TableTransforms.Quantile","page":"Built-in","title":"TableTransforms.Quantile","text":"Quantile(; dist=Normal())\n\nThe quantile transform to a given distribution.\n\nQuantile(col₁, col₂, ..., colₙ; dist=Normal())\nQuantile([col₁, col₂, ..., colₙ]; dist=Normal())\nQuantile((col₁, col₂, ..., colₙ); dist=Normal())\n\nApplies the Quantile transform on columns col₁, col₂, ..., colₙ.\n\nQuantile(regex; dist=Normal())\n\nApplies the Quantile transform on columns that match with regex.\n\nExamples\n\nusing Distributions\n\nQuantile()\nQuantile(dist=Normal())\nQuantile(1, 3, 5, dist=Beta())\nQuantile([:a, :c, :e], dist=Gamma())\nQuantile((\"a\", \"c\", \"e\"), dist=Beta())\nQuantile(r\"[ace]\", dist=Normal())\n\n\n\n\n\n","category":"type"},{"location":"transforms/builtin/#Functional","page":"Built-in","title":"Functional","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"Functional","category":"page"},{"location":"transforms/builtin/#TableTransforms.Functional","page":"Built-in","title":"TableTransforms.Functional","text":"Functional(func)\n\nThe transform that applies a func elementwise.\n\nFunctional(col₁ => func₁, col₂ => func₂, ..., colₙ => funcₙ)\n\nApply the corresponding funcᵢ function to each colᵢ column.\n\nExamples\n\nFunctional(cos)\nFunctional(sin)\nFunctional(1 => cos, 2 => sin)\nFunctional(:a => cos, :b => sin)\nFunctional(\"a\" => cos, \"b\" => sin)\n\n\n\n\n\n","category":"type"},{"location":"transforms/builtin/#EigenAnalysis","page":"Built-in","title":"EigenAnalysis","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"EigenAnalysis","category":"page"},{"location":"transforms/builtin/#TableTransforms.EigenAnalysis","page":"Built-in","title":"TableTransforms.EigenAnalysis","text":"EigenAnalysis(proj; maxdim=nothing, pratio=1.0)\n\nThe eigenanalysis of the covariance with a given projection proj. Optionally specify the maximum number of dimensions in the output maxdim and the percentage of variance to retain pratio. Default to all dimensions of the input.\n\nProjections\n\n:V - Uncorrelated variables (PCA transform)\n:VD - Uncorrelated variables and variance one (DRS transform)\n:VDV - Uncorrelated variables and variance one (SDS transformation)\n\nThe :V projection used in the PCA transform projects the data on the eigenvectors V of the covariance matrix.\n\nThe :VD projection used in the DRS transform. Similar to the :V projection, but the eigenvectors are multiplied by the squared inverse of the eigenvalues D.\n\nThe :VDV projection used in the SDS transform. Similar to the :VD transform, but the data is projected back to the basis of the original variables using the Vᵀ matrix.\n\nSee https://geostatisticslessons.com/lessons/sphereingmaf for more details about these three variants of eigenanalysis.\n\nExamples\n\nEigenAnalysis(:V)\nEigenAnalysis(:VD)\nEigenAnalysis(:VDV)\nEigenAnalysis(:V, maxdim=3)\nEigenAnalysis(:VD, pratio=0.99)\nEigenAnalysis(:VDV, maxdim=3, pratio=0.99)\n\n\n\n\n\n","category":"type"},{"location":"transforms/builtin/#PCA","page":"Built-in","title":"PCA","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"PCA","category":"page"},{"location":"transforms/builtin/#TableTransforms.PCA","page":"Built-in","title":"TableTransforms.PCA","text":"PCA(; maxdim=nothing, pratio=1.0)\n\nThe PCA transform is a shortcut for ZScore() → EigenAnalysis(:V; maxdim, pratio).\n\nSee also: ZScore, EigenAnalysis.\n\nExamples\n\nPCA(maxdim=2)\nPCA(pratio=0.86)\nPCA(maxdim=2, pratio=0.86)\n\n\n\n\n\n","category":"function"},{"location":"transforms/builtin/#DRS","page":"Built-in","title":"DRS","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"DRS","category":"page"},{"location":"transforms/builtin/#TableTransforms.DRS","page":"Built-in","title":"TableTransforms.DRS","text":"DRS(; maxdim=nothing, pratio=1.0)\n\nThe DRS transform is a shortcut for ZScore() → EigenAnalysis(:VD; maxdim, pratio).\n\nSee also: ZScore, EigenAnalysis.\n\nExamples\n\nDRS(maxdim=3)\nDRS(pratio=0.87)\nDRS(maxdim=3, pratio=0.87)\n\n\n\n\n\n","category":"function"},{"location":"transforms/builtin/#SDS","page":"Built-in","title":"SDS","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"SDS","category":"page"},{"location":"transforms/builtin/#TableTransforms.SDS","page":"Built-in","title":"TableTransforms.SDS","text":"SDS(; maxdim=nothing, pratio=1.0)\n\nThe SDS transform is a shortcut for ZScore() → EigenAnalysis(:VDV; maxdim, pratio).\n\nSee also: ZScore, EigenAnalysis.\n\nExamples\n\nSDS()\nSDS(maxdim=4)\nSDS(pratio=0.88)\nSDS(maxdim=4, pratio=0.88)\n\n\n\n\n\n","category":"function"},{"location":"transforms/builtin/#RowTable","page":"Built-in","title":"RowTable","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"RowTable","category":"page"},{"location":"transforms/builtin/#TableTransforms.RowTable","page":"Built-in","title":"TableTransforms.RowTable","text":"RowTable()\n\nThe transform that applies the function Tables.rowtable to to the input table.\n\n\n\n\n\n","category":"type"},{"location":"transforms/builtin/#ColTable","page":"Built-in","title":"ColTable","text":"","category":"section"},{"location":"transforms/builtin/","page":"Built-in","title":"Built-in","text":"ColTable","category":"page"},{"location":"transforms/builtin/#TableTransforms.ColTable","page":"Built-in","title":"TableTransforms.ColTable","text":"ColTable()\n\nThe transform that applies the function Tables.columntable to to the input table.\n\n\n\n\n\n","category":"type"}]
}
